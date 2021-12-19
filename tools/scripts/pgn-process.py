import chess.pgn
import re
import psycopg2
import hashlib
import sys
from os import listdir
from os import rename
from os.path import isfile, join
from getopt import getopt
from datetime import datetime
from dotenv import dotenv_values

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
		"chessbomb",
		"caissabase"
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

config = {
	**dotenv_values("../../config/.env." + enviro),
	**dotenv_values("../../config/.env")
}

db_host     = config["MASTERGAMES_DB_HOST"]
db_port     = config["MASTERGAMES_DB_PORT"]
db_username = config["MASTERGAMES_DB_USERNAME"]
db_password = config["MASTERGAMES_DB_PASSWORD"]
db_database = config["MASTERGAMES_DB_DATABASE"]

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
	"local"      : 0,
	"pgnmentor"  : 1,
	"chessbomb"  : 2,
	"caissabase" : 3
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
		
		if (len(moves) >= 400):
			continue

		record["event"]       = game.headers["Event"]
		record["round"]       = None if ("Round" not in game.headers) else game.headers["Round"]
		record["movelist"]    = re.sub("[^A-Za-z\d\._]", "", ".".join(moves).replace("=", "_"))
		record["eco"]         = None if ("ECO" not in game.headers) else game.headers["ECO"]
		record["white"]       = game.headers["White"].replace(", ", ",").replace(",", ", ")
		record["black"]       = game.headers["Black"].replace(", ", ",").replace(",", ", ")
		record["white_elo"]   = 0 if ("WhiteElo" not in game.headers) else 0 if (game.headers["WhiteElo"] in ["", "?"]) else int(game.headers["WhiteElo"])
		record["black_elo"]   = 0 if ("BlackElo" not in game.headers) else 0 if (game.headers["BlackElo"] in ["", "?"]) else int(game.headers["BlackElo"])
		record["white_title"] = None if ("WhiteTitle" not in game.headers) else game.headers["WhiteTitle"]
		record["black_title"] = None if ("BlackTitle" not in game.headers) else game.headers["BlackTitle"]
		record["source"]      = source_enum[source]

		str_result = (("D", "B")[result == "0-1"], "W")[result == "1-0"]
		result     = ((2, 0)[result == "0-1"], 1)[result == "1-0"]

		record["result"]   = result
		record["location"] = game.headers["Site"]

		date     = game.headers["Date"].split(".")
		exporter = chess.pgn.StringExporter(headers=True, variations=True, comments=True)

		if (source == "caissabase"):
			record["white_fide_id"] = None if ("WhiteFideId" not in game.headers) else game.headers["WhiteFideId"]
			record["black_fide_id"] = None if ("BlackFideId" not in game.headers) else game.headers["BlackFideId"]
		else:
			record["white_fide_id"] = None if ("WhiteFIDE" not in game.headers) else game.headers["WhiteFIDE"]
			record["black_fide_id"] = None if ("BlackFIDE" not in game.headers) else game.headers["BlackFIDE"]

		if (source == "pgnmentor" or source == "caissabase"):
			record["year"]  = None if (date[0] == "????") else int(date[0])
			record["month"] = None if (date[1] == "??") else int(date[1])
			record["day"]   = None if (date[2] == "??" or len(date[2]) == 0) else int(date[2])
		elif (source == "chessbomb"):
			date = datetime.strptime(game.headers["Date"], "%Y-%m-%dT%H:%M:%S.%fZ")

			record["year"]  = date.strftime("%Y")
			record["month"] = date.strftime("%m")
			record["day"]   = date.strftime("%d")

			header_year        = game.headers["Event"][-4:]
			second_header_year = game.headers["Event"][-9:-5]

			if (str(record["year"]) != header_year and header_year.isdigit() and (str(record["year"]) != second_header_year or !second_header_year.isdigit())):
				record["year"]  = header_year
				record["month"] = None
				record["day"]   = None

		record["pgn"] = game.accept(exporter)
		record["id"]  = hashlib.md5(
			(
				re.sub("[^A-Za-z]", "", record["white"].split(",")[0]) + ":" +
				re.sub("[^A-Za-z]", "", record["black"].split(",")[0]) + ":" +
				str_result + ":" +
				str(record["year"]) + ":" +
				str(record["month"]) + ":" +
				str(record["day"]) + ":" +
				record["movelist"]
			).lower().encode("utf-8")
		).hexdigest()
		record["id"]  = record["id"][0:8] + "-" + record["id"][8:12] + "-" + record["id"][12:16] + "-" + record["id"][16:20] + "-" + record["id"][20:32]

		if (source == "caissabase"):
			print(record["id"])

		# print(record["white"], record["black"])
		conflict = "NOTHING" if enviro == "pgnmentor" else """
			UPDATE SET
				event = CASE WHEN master_games.source = 1 THEN EXCLUDED.event ELSE master_games.event END,
				round = CASE WHEN master_games.source = 1 THEN EXCLUDED.round ELSE master_games.round END,
				year = CASE WHEN master_games.source = 1 THEN EXCLUDED.year ELSE master_games.year END,
				month = CASE WHEN master_games.source = 1 THEN EXCLUDED.month ELSE master_games.month END,
				day = CASE WHEN master_games.source = 1 THEN EXCLUDED.day ELSE master_games.day END,
				white_elo = CASE WHEN master_games.source = 1 THEN EXCLUDED.white_elo ELSE master_games.white_elo END,
				black_elo = CASE WHEN master_games.source = 1 THEN EXCLUDED.black_elo ELSE master_games.black_elo END,
				white_title = CASE WHEN master_games.source = 1 THEN EXCLUDED.white_title ELSE master_games.white_title END,
				black_title = CASE WHEN master_games.source = 1 THEN EXCLUDED.black_title ELSE master_games.black_title END,
				white_fide_id = CASE WHEN master_games.source = 1 THEN EXCLUDED.white_fide_id ELSE master_games.white_fide_id END,
				black_fide_id = CASE WHEN master_games.source = 1 THEN EXCLUDED.black_fide_id ELSE master_games.black_fide_id END,
				white = CASE WHEN master_games.source = 1 THEN EXCLUDED.white ELSE master_games.white END,
				black = CASE WHEN master_games.source = 1 THEN EXCLUDED.black ELSE master_games.black END,
				pgn = CASE WHEN master_games.source = 1 THEN EXCLUDED.pgn ELSE master_games.pgn END,
				source = CASE WHEN master_games.source = 1 THEN EXCLUDED.source ELSE master_games.source END
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