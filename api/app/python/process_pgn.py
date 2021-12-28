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
		ucis  = []
		fens  = []

		for move in game.mainline():
			moves.append(move.san())
			ucis.append(move.uci())
			fens.append(move.board().fen())

		games.append({
			"pgn"    : str(game),
			"moves"  : moves,
			"ucis"   : ucis,
			"fens"   : fens,
			"result" : None if ("Result" not in game.headers) else game.headers["Result"],
			"white"  : None if ("White" not in game.headers) else game.headers["White"],
			"black"  : None if ("Black" not in game.headers) else game.headers["Black"],
			"date"   : None if ("Date" not in game.headers) else game.headers["Date"],
			"event"  : None if ("Event" not in game.headers) else game.headers["Event"],
			"round"  : None if ("Round" not in game.headers) else game.headers["Round"]
		})

	print(json.dumps(games))
	data.close()
except:
	print(False)