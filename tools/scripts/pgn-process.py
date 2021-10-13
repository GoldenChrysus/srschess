import chess.pgn
import re
import psycopg2
import hashlib
import yaml
import sys
from os import listdir
from os import rename
from os.path import isfile, join
from getopt import getopt
from datetime import datetime

enviro = False
source = False
valid  = {
	"enviro" : [
		"development",
		"test",
		"production"
	],
	"source" : [
		"pgnmentor",
		"chessbomb"
	],
	"result" : [
		"1/2-1/2",
		"1-0",
		"0-1"
	]
}

try:
	opts, args = getopt(sys.argv[1:], "e:s:")
except getopt.GetoptError:
	print("pgn-process.py -e <environment> -s <source>")
	sys.exit(2)

for opt, arg in opts:
	if opt == "-e":
		enviro = arg
	elif opt == "-s":
		source = arg
	else:
		print("Invalid option: " + opt)
		sys.exit(2)

if enviro not in valid["enviro"]:
	print("Invalid environment.")
	sys.exit(2)

if source not in valid["source"]:
	print("Invalid source.")
	sys.exit(2)

with open("../../api/config/application.yml", "r") as stream:
	yaml_data = yaml.safe_load(stream);

db_host     = yaml_data["db_host"] if ("db_host" not in yaml_data[enviro]) else yaml_data[enviro]["db_host"]
db_port     = yaml_data["db_port"] if ("db_port" not in yaml_data[enviro]) else yaml_data[enviro]["db_port"]
db_username = yaml_data["db_username"] if ("db_username" not in yaml_data[enviro]) else yaml_data[enviro]["db_username"]
db_password = yaml_data["db_password"] if ("db_password" not in yaml_data[enviro]) else yaml_data[enviro]["db_password"]
db_database = yaml_data[enviro]["db_database"]

conn = psycopg2.connect(database=db_database, user=db_username, password=db_password, host=db_host, port=db_port)
cur  = conn.cursor()
path = "data/" + source + "/games/"

files = [file for file in sorted(listdir(path)) if isfile(join(path, file))]

def getGame(data):
	good = False

	while (good == False):
		try:
			game = chess.pgn.read_game(data)
			good = True
		except:
			good = False

	return game

source_enum = {
	"pgnmentor" : 1,
	"chessbomb" : 2,
	"local"     : 3
}

for file in files:
	print(file)
	if (len(re.findall("pgn$", file)) == 0):
		continue

	data = open(path + file, encoding="latin-1")
	game = chess.pgn.read_game(data)

	while (game != None):
		record = {}
		moves  = []
		result = game.headers["Result"]

		if result not in valid["result"] or ("WhiteElo" in game.headers and ":" in game.headers["WhiteElo"]):
			game = getGame(data)

			continue

		for move in game.mainline():
			moves.append(move.san())

		record["event"]         = game.headers["Event"]
		record["round"]         = None if ("Round" not in game.headers) else game.headers["Round"]
		record["movelist"]      = re.sub("[^A-Za-z\d\.]", "", ".".join(moves).replace("=", "_"))
		record["eco"]           = None if ("ECO" not in game.headers) else game.headers["ECO"]
		record["white"]         = game.headers["White"].replace(", ", ",").replace(",", ", ")
		record["black"]         = game.headers["Black"].replace(", ", ",").replace(",", ", ")
		record["white_elo"]     = 0 if ("WhiteElo" not in game.headers) else 0 if (game.headers["WhiteElo"] in ["", "?"]) else int(game.headers["WhiteElo"])
		record["black_elo"]     = 0 if ("BlackElo" not in game.headers) else 0 if (game.headers["BlackElo"] in ["", "?"]) else int(game.headers["BlackElo"])
		record["white_title"]   = None if ("WhiteTitle" not in game.headers) else game.headers["WhiteTitle"]
		record["black_title"]   = None if ("BlackTitle" not in game.headers) else game.headers["BlackTitle"]
		record["white_fide_id"] = None if ("WhiteFIDE" not in game.headers) else game.headers["WhiteFIDE"]
		record["black_fide_id"] = None if ("BlackFIDE" not in game.headers) else game.headers["BlackFIDE"]
		record["source"]        = source_enum[source]

		result = ((2, 0)[result == "0-1"], 1)[result == "1-0"]

		record["result"]   = result
		record["location"] = game.headers["Site"]

		date     = game.headers["Date"].split(".")
		exporter = chess.pgn.StringExporter(headers=True, variations=True, comments=True)

		if (source == "pgnmentor"):
			record["year"]  = None if (date[0] == "????") else int(date[0])
			record["month"] = None if (date[1] == "??") else int(date[1])
			record["day"]   = None if (date[2] == "??" or len(date[2]) == 0) else int(date[2])
		elif (source == "chessbomb"):
			date = datetime.strptime(game.headers["Date"], "%Y-%m-%dT%H:%M:%S.%fZ")

			record["year"]  = date.strftime("%Y")
			record["month"] = date.strftime("%m")
			record["day"]   = date.strftime("%d")

			header_year = game.headers["Event"][-4:]

			if (str(record["year"]) != header_year and header_year.isdigit()):
				record["year"]  = header_year
				record["month"] = None
				record["day"]   = None

		record["pgn"] = game.accept(exporter)
		record["id"]  = hashlib.md5(
			(
				re.sub("[^A-Za-z]", "", record["white"].split(",")[0]) + ":" +
				re.sub("[^A-Za-z]", "", record["black"].split(",")[0]) + ":" +
				record["result"] + ":" +
				str(record["year"]) + ":" +
				str(record["month"]) + ":" +
				str(record["day"]) + ":" +
				record["movelist"]
			).lower().encode("utf-8")
		).hexdigest()
		record["id"]  = record["id"][0:8] + "-" + record["id"][8:12] + "-" + record["id"][12:16] + "-" + record["id"][16:20] + "-" + record["id"][20:32]

		# print(record["white"], record["black"])
		conflict = "NOTHING" if enviro == "pgnmentor" else """
			UPDATE SET
				event = EXCLUDED.event,
				round = EXCLUDED.round,
				year = EXCLUDED.year,
				month = EXCLUDED.month,
				day = EXCLUDED.day,
				white_elo = EXCLUDED.white_elo,
				black_elo = EXCLUDED.black_elo,
				white_title = EXCLUDED.white_title,
				black_title = EXCLUDED.black_title,
				white_fide_id = EXCLUDED.white_fide_id,
				black_fide_id = EXCLUDED.black_fide_id,
				white = EXCLUDED.white,
				black = EXCLUDED.black,
				pgn = EXCLUDED.pgn
		"""

		cur.execute("""
			INSERT INTO
				master_games
					(
						id,
						source,
						event,
						round,
						movelist,
						eco,
						white,
						black,
						white_elo,
						black_elo,
						white_title,
						black_title,
						white_fide_id,
						black_fide_id,
						result,
						location,
						year,
						month,
						day,
						pgn,
						created_at,
						updated_at
					)
			VALUES
				(
					%(id)s,
					%(source)s,
					%(event)s,
					%(round)s,
					%(movelist)s,
					%(eco)s,
					%(white)s,
					%(black)s,
					%(white_elo)s,
					%(black_elo)s,
					%(white_title)s,
					%(black_title)s,
					%(white_fide_id)s,
					%(black_fide_id)s,
					%(result)s,
					%(location)s,
					%(year)s,
					%(month)s,
					%(day)s,
					%(pgn)s,
					CURRENT_TIMESTAMP,
					CURRENT_TIMESTAMP
				)
			ON CONFLICT (id)
				DO """ + conflict,
			record
		)

		game = getGame(data)

	data.close()
	conn.commit()
	rename(path + file, path + "processed/" + file)

conn.close()