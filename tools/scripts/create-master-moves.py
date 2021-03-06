import chess.pgn
import io
import psycopg2
import math
import sys
import multiprocessing
from time import sleep
from getopt import getopt
from dotenv import dotenv_values

enviro = False
valid  = {
	"enviro" : [
		"development",
		"test",
		"production"
	]
}

try:
	opts, args = getopt(sys.argv[1:], "e:")
except getopt.GetoptError:
	print("create-master-moves.py -e <environment>")
	sys.exit(2)

for opt, arg in opts:
	if opt == "-e":
		enviro = arg
	else:
		print(f"Invalid option: {opt}")
		sys.exit(2)

if enviro not in valid["enviro"]:
	print("Invalid environment.")
	sys.exit(2)

config = {
	**dotenv_values("../../config/.env"),
	**dotenv_values("../../config/.env." + enviro)
}

db_host     = config["MASTERGAMES_DB_HOST"]
db_port     = config["MASTERGAMES_DB_PORT"]
db_username = config["MASTERGAMES_DB_USERNAME"]
db_password = config["MASTERGAMES_DB_PASSWORD"]
db_database = config["MASTERGAMES_DB_DATABASE"]
proc_count  = multiprocessing.cpu_count() * 4

conn = psycopg2.connect(database=db_database, user=db_username, password=db_password, host=db_host, port=db_port)
cur  = conn.cursor()
sql  = """
	SELECT
		g.id,
		g.pgn
	FROM
		master_games g
	WHERE
		NLEVEL(g.movelist) > 0 AND
		NOT EXISTS
			(
				SELECT
					1
				FROM
					master_game_moves mg
				WHERE
					mg.master_game_id = g.id
				LIMIT
					1
			)
"""

cur.execute(sql)

all_data = cur.fetchall()
ids      = [record[0] for record in all_data]

if (len(ids) > 0 and False):
	ids = "', '".join(ids)
	sql = """
		UPDATE
			master_games
		SET
			processed = TRUE
		WHERE
			id IN ('""" + ids + "')"

	cur.execute(sql)
	conn.commit()

cur.close()
conn.close()

def process_games(num, chunk_size):
	print(f"P{num}: Starting PGN")

	offset = chunk_size * num
	conn   = psycopg2.connect(database=db_database, user=db_username, password=db_password, host=db_host, port=db_port)
	cur    = conn.cursor()

	for row in all_data[offset:(offset + chunk_size)]:
		id     = row[0]
		pgn    = io.StringIO(row[1])
		game   = chess.pgn.read_game(pgn)
		tuples = []

		for move in game.mainline():
			record = {
				"master_game_id" : id,
				"ply"            : move.ply(),
				"move"           : move.san(),
				"uci"            : move.uci(),
				"fen"            : " ".join(move.board().fen().split(" ")[0:4])
			}

			tuples.append(record)

		if (len(tuples) == 0):
			continue

		values = ", ".join(cur.mogrify("(%(master_game_id)s, %(ply)s, %(move)s, %(uci)s, %(fen)s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", x).decode("utf-8") for x in tuples)
		sql    = """
			INSERT INTO
				master_game_moves
					(master_game_id, ply, move, uci, fen, created_at, updated_at)
			VALUES
		""" + values + """
			ON CONFLICT
				DO NOTHING
		"""

		cur.execute(sql)
		conn.commit()
		print(f"P{num}: {id}")
		sleep(0.01)
	
	print(f"P{num}: Finished PGN")
	cur.close()
	conn.close()

if __name__ == "__main__":
	count = len(all_data)

	print(f"Count: {count}")

	processes  = []
	chunk_size = math.ceil(count / proc_count)

	for i in range(proc_count):
		process = multiprocessing.Process(target=process_games, args=(i, chunk_size))

		processes.append(process)
		process.start()
	
	for process in processes:
		process.join()