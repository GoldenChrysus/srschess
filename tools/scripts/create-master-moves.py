import chess.pgn
import io
import psycopg2
import yaml
import sys
from getopt import getopt

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
		print("Invalid option: " + opt)
		sys.exit(2)

if enviro not in valid["enviro"]:
	print("Invalid environment.")
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
sql  = """
	SELECT
		g.id,
		g.pgn
	FROM
		master_games g
	LEFT JOIN
		master_game_moves mg
	ON
		mg.master_game_id = g.id
	WHERE
		mg.id IS NULL
"""

cur.execute(sql)

while True:
	row = cur.fetchone()

	if (row == None):
		break

	id   = row[0]
	pgn  = io.StringIO(row[1])
	game = chess.pgn.read_game(pgn)

	for move in game.mainline():
		record = {
			"master_game_id" : id,
			"ply"            : move.ply(),
			"move"           : move.san(),
			"uci"            : move.uci(),
			"fen"            : " ".join(move.board().fen().split(" ")[0:4])
		}

		sql = """
			INSERT INTO
				master_game_moves
					(master_game_id, ply, move, uci, fen, created_at, updated_at)
			VALUES
				(%(master_game_id)s, %(ply)s, %(move)s, %(uci)s, %(fen)s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		"""

		tmp_cur = conn.cursor()

		tmp_cur.execute(sql, record)
		tmp_cur.close()
	
	conn.commit()
	print(id)