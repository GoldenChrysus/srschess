import chess.pgn
import io
import sys

try:
	class NoErrorVisitor(chess.pgn.GameBuilder):
		def handle_error(self, error: Exception) -> None:
			sys.exit(0)

	pgn  = None if (len(sys.argv) != 2) else sys.argv[1]
	pgn  = io.StringIO(pgn)
	game = chess.pgn.read_game(pgn, Visitor=NoErrorVisitor)

	print(True)
except:
	pass
	print(False)