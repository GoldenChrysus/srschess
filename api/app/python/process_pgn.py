import chess.pgn
import json
import sys

try:
	file  = None if (len(sys.argv) != 2) else sys.argv[1]
	data  = open(file)
	games = []

	while (True):
		game = chess.pgn.read_game(data)

		if (game == None):
			break

		moves = []

		for move in game.mainline():
			moves.append(move.san())

		games.append({
			"pgn"   : str(game),
			"moves" : moves
		})

	print(json.dumps(games))
	data.close()
except:
	print(False)