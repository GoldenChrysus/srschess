import chess.pgn

def readNode(move, level = 0):
	if (move == None):
		return

	indent = "-" * level

	print(indent + str(move.ply()) + " " + move.san())

	for submove in move.variations:
		if submove.starts_variation() == False:
			continue

		readNode(submove, level + 1)
	
	readNode(move.next(), level)

data = open("test.pgn")
game = chess.pgn.read_game(data)

for move in game.mainline():
	readNode(move)
	break