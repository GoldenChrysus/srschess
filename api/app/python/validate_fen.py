import chess
import sys

try:
	fen   = None if (len(sys.argv) != 2) else sys.argv[1]
	board = chess.Board(fen)

	print(board.is_valid())
except:
	print(False)