import chess.pgn
import firebase_admin
import hashlib
import math
import multiprocessing
import psycopg2
import re
import sys
import unicodedata
from datetime import datetime
from dotenv import dotenv_values
from firebase_admin import credentials
from firebase_admin import firestore
from getopt import getopt
from os import listdir
from os import rename
from os.path import isfile, join
from time import sleep

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
		"caissabase",
		"365chess"
	],
	"result" : [
		"1/2-1/2",
		"1-0",
		"0-1"
	]
}

# Environment init
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
		print(f"Invalid option: {opt}")
		sys.exit(2)

if enviro not in valid["enviro"]:
	print("Invalid environment.")
	sys.exit(2)

if source not in valid["source"]:
	print("Invalid source.")
	sys.exit(2)

config = {
	**dotenv_values("../../config/.env"),
	**dotenv_values(f"../../config/.env.{enviro}")
}

# Firebase init
creds = credentials.Certificate(f"../../config/firebase.service.{enviro}.json");

firebase_admin.initialize_app(creds)

fire_db = firestore.client()

# Database init
db_host     = config["MASTERGAMES_DB_HOST"]
db_port     = config["MASTERGAMES_DB_PORT"]
db_username = config["MASTERGAMES_DB_USERNAME"]
db_password = config["MASTERGAMES_DB_PASSWORD"]
db_database = config["MASTERGAMES_DB_DATABASE"]

## Files init
path  = f"data/{source}/games/"
files = [file for file in sorted(listdir(path)) if isfile(join(path, file))]

def getGame(data):
	good = False

	while (good == False):
		try:
			game = chess.pgn.read_game(data)
			good = True
		except:
			pass

			good = False

	return game

source_enum = {
	"local"      : 0,
	"pgnmentor"  : 1,
	"chessbomb"  : 2,
	"caissabase" : 3,
	"365chess"   : 4
}

def make_process(num, chunk_size):
	offset = chunk_size * num
	conn   = psycopg2.connect(database=db_database, user=db_username, password=db_password, host=db_host, port=db_port)
	cur    = conn.cursor()

	with open(f"state/ids.{enviro}.{source}.txt", "a+") as ids_file:
		ids_file.seek(0)

		ids = ids_file.read().split("\n")

		for file in files[offset:(offset + chunk_size)]:
			if (len(re.findall("A32\.pgn$", file)) == 0):
				continue

			data = open(path + file, encoding="latin-1")
			game = getGame(data)

			print(f"P{num}: Starting: {file}")

			while (game != None):
				record    = {}
				fb_record = {
					"fens"        : [],
					"moves"       : {},
					"white_names" : [],
					"black_names" : []
				}
				moves     = []
				result    = game.headers["Result"]

				if result not in valid["result"] or ("WhiteElo" in game.headers and ":" in game.headers["WhiteElo"]):
					game = getGame(data)

					continue

				try:
					for move in game.mainline():
						san = move.san()

						moves.append(san)
						
						fen = " ".join(move.board().fen().split(" ")[0:4])

						fb_record["fens"].append(fen)
						fb_record["moves"][str(move.ply())] = {
							"movelist" : ".".join(moves),
							"san"      : san,
							"uci"      : move.uci(),
							"fen"      : fen
						}
				except:
					pass

					game = getGame(data)

					continue
				
				if (len(moves) >= 400 or len(moves) == 0):
					game = getGame(data)

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

				if (source in ["pgnmentor", "caissabase", "365chess"]):
					record["year"]  = None if (date[0] == "????") else int(date[0])
					record["month"] = None if (date[1] == "??") else int(date[1])
					record["day"]   = None if (date[2] == "??" or len(date[2]) == 0) else int(date[2])
				elif (source == "chessbomb"):
					date = datetime.strptime(game.headers["Date"], "%Y-%m-%dT%H:%M:%S.%fZ")

					record["year"]  = date.strftime("%Y")
					record["month"] = date.strftime("%m")
					record["day"]   = date.strftime("%d")

					header_year   = game.headers["Event"][-4:]
					header_letter = game.headers["Event"][-5:-4]

					if (str(record["year"]) != header_year and header_year.isdigit() and int(header_year) < 2000 and int(header_year) >= 1900 and (header_letter == " " or header_letter == "-")):
						continue

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

				if record["id"] in ids:
					game = getGame(data)

					continue

				fb_record["white"]     = record["white"]
				fb_record["black"]     = record["black"]
				fb_record["white_elo"] = record["white_elo"]
				fb_record["black_elo"] = record["black_elo"]
				fb_record["result"]    = record["result"]
				fb_record["eco"]       = record["eco"]
				fb_record["event"]     = record["event"]
				fb_record["round"]     = record["round"]

				for side in ["white", "black"]:
					name = unicodedata.normalize("NFD", fb_record[side])
					name = name.encode("ascii", "ignore")
					name = name.decode("utf-8").lower()
					key  = side + "_names"
					val  = list(filter(
						lambda x: x,
						name.split(" ") if "," not in name else name.replace(",", "").split(" ")
					))

					if "," not in name:
						val.reverse()
					elif (len(val) > 2):
						val = val[0:2]

					fb_record[key].append("".join(val))

					if (len(val) > 1):
						fb_record[key].append(val[0] + val[-1])
						fb_record[key].append(val[0] + val[-1][0])

					fb_record[key] = list(dict.fromkeys(fb_record[key]))

				# fire_db.collection("master_games").document(record["id"]).set(fb_record)

				conflict = """
					UPDATE SET
						event = COALESCE(NULLIF(master_games.event, ''), EXCLUDED.event),
						round = COALESCE(NULLIF(master_games.round, ''), EXCLUDED.round),
						year = COALESCE(NULLIF(master_games.year, 0), EXCLUDED.year),
						month = COALESCE(NULLIF(master_games.month, 0), EXCLUDED.month),
						day = COALESCE(NULLIF(master_games.day, 0), EXCLUDED.day),
						white_elo = COALESCE(NULLIF(master_games.white_elo, 0), EXCLUDED.white_elo),
						black_elo = COALESCE(NULLIF(master_games.black_elo, 0), EXCLUDED.black_elo),
						white_title = COALESCE(NULLIF(master_games.white_title, ''), EXCLUDED.white_title),
						black_title = COALESCE(NULLIF(master_games.black_title, ''), EXCLUDED.black_title),
						white_fide_id = COALESCE(NULLIF(master_games.white_fide_id, ''), EXCLUDED.white_fide_id),
						black_fide_id = COALESCE(NULLIF(master_games.black_fide_id, ''), EXCLUDED.black_fide_id),
						white = COALESCE(NULLIF(master_games.white, ''), EXCLUDED.white),
						black = COALESCE(NULLIF(master_games.black, ''), EXCLUDED.black),
						pgn = CASE WHEN LENGTH(master_games.pgn) > LENGTH(COALESCE(EXCLUDED.pgn, '')) THEN master_games.pgn ELSE EXCLUDED.pgn END
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
				conn.commit()
				ids_file.write(record["id"] + "\n")
				ids.append(record["id"])

				game = getGame(data)

			print(f"   P{num}: Finished: {file}")
			data.close()
			rename(path + file, f"{path}processed/{enviro}/{file}")

		ids_file.close()

	conn.close()

if __name__ == "__main__":
	count = len(files)

	print(f"Count: {count}")

	processes  = []
	proc_count = multiprocessing.cpu_count() * 2
	chunk_size = math.ceil(count / proc_count)

	for i in range(proc_count):
		process = multiprocessing.Process(target=make_process, args=(i, chunk_size))

		processes.append(process)
		process.start()
	
	for process in processes:
		process.join()