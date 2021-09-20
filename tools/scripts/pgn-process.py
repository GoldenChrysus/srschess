import chess.pgn
import re
import psycopg2
import hashlib
import yaml
from os import listdir
from os import rename
from os.path import isfile, join

enviro = "development"

with open("../../api/config/application.yml", "r") as stream:
	yaml_data = yaml.safe_load(stream);

db_host     = yaml_data["db_host"] if ("db_host" not in yaml_data[enviro]) else yaml_data[enviro]["db_host"]
db_port     = yaml_data["db_port"] if ("db_port" not in yaml_data[enviro]) else yaml_data[enviro]["db_port"]
db_username = yaml_data["db_username"] if ("db_username" not in yaml_data[enviro]) else yaml_data[enviro]["db_username"]
db_password = yaml_data["db_password"] if ("db_password" not in yaml_data[enviro]) else yaml_data[enviro]["db_password"]
db_database = yaml_data[enviro]["db_database"]

conn     = psycopg2.connect(database=db_database, user=db_username, password=db_password, host=db_host, port=db_port)
cur      = conn.cursor()
path     = "data/master-games/"
exporter = chess.pgn.StringExporter(headers=True, variations=True, comments=True)

files = [file for file in sorted(listdir(path)) if isfile(join(path, file))]

for file in files:
	if (len(re.findall("pgn$", file)) == 0):
		continue

	data = open(path + file)
	game = chess.pgn.read_game(data)

	while (game != None):
		record = {}
		moves  = []

		for move in game.mainline():
			moves.append(move.san())

		record["movelist"]  = re.sub("[^A-Za-z\d\.]", "", ".".join(moves).replace("=", "_"))
		record["eco"]       = None if ("ECO" not in game.headers) else game.headers["ECO"]
		record["white"]     = game.headers["White"]
		record["black"]     = game.headers["Black"]
		record["white_elo"] = 0 if ("WhiteElo" not in game.headers) else 0 if (game.headers["WhiteElo"] == "") else int(game.headers["WhiteElo"])
		record["black_elo"] = 0 if ("BlackElo" not in game.headers) else 0 if (game.headers["BlackElo"] == "") else int(game.headers["BlackElo"])

		result = game.headers["Result"]
		result = (("draw", "black")[result == "0-1"], "white")[result == "1-0"]

		record["result"]   = result
		record["location"] = game.headers["Site"]

		date = game.headers["Date"].split(".")

		record["year"]  = None if (date[0] == "????") else int(date[0])
		record["month"] = None if (date[1] == "??") else int(date[1])
		record["day"]   = None if (date[2] == "??") else int(date[2])
		record["pgn"]   = game.accept(exporter)
		record["id"]    = hashlib.md5(record["pgn"].encode("ASCII")).hexdigest()
		record["id"]    = record["id"][0:8] + "-" + record["id"][8:12] + "-" + record["id"][12:16] + "-" + record["id"][16:20] + "-" + record["id"][20:32]

		cur.execute("""
			INSERT INTO
				master_games
					(movelist, eco, white, black, white_elo, black_elo, result, location, year, month, day, pgn, id, created_at, updated_at)
			VALUES
				(%(movelist)s, %(eco)s, %(white)s, %(black)s, %(white_elo)s, %(black_elo)s, %(result)s, %(location)s, %(year)s, %(month)s, %(day)s, %(pgn)s, %(id)s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
			ON CONFLICT
				DO NOTHING
			""",
			record
		)

		game = chess.pgn.read_game(data)

	data.close()
	conn.commit()
	break
	rename(path + file, path + "processed/" + file)

conn.close()