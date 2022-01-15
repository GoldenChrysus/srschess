import chess.pgn
from hashlib import md5
import json
import math
import re
import uuid
import sys

try:
	moves         = {}
	id_map        = {}
	reperotire_id = None if (len(sys.argv) != 3) else sys.argv[1]
	color_map     = {
		"R" : "red",
		"G" : "green",
		"O" : "orange",
		"B" : "blue",
		"W" : "white",
		"Y" : "yellow"
	}

	def readNode(move, level = 0, parent_id = None):
		if (move == None):
			return

		if (len(moves) == 0 and move.ply() != 1):
			raise ValueError

		indent = "-" * level

		db_move_num = math.floor(((move.ply() + 1) / 2) * 10)

		fen    = move.board().fen()
		san    = move.san()
		id_fen = fen.split(" ")
		
		id_fen[4] = "x"

		id_fen  = " ".join(id_fen)
		id_hash = md5((f"{reperotire_id}:{db_move_num}:{san}:{id_fen}").encode()).hexdigest()
		id      = str(uuid.UUID(id_hash))

		comment = move.comment.strip()
		arrow   = []

		if (comment != ""):
			code_exp  = r"\[%[^]]+\]"
			codes     = re.findall(code_exp, comment)
			comment   = re.sub(code_exp, "", comment).strip()
			arrow_exp = r"\[%cal ([A-Z][a-z]\d([a-z][\d])?,?)+\]"

			for code in codes:
				if (re.match(arrow_exp, code) == None):
					continue

				arrows_exp = r"([A-Za-z\d]+?)(?:,|\])"
				arrows     = re.findall(arrows_exp, code)

				for arrow_data in arrows:
					color_code = arrow_data[0]

					if (color_code not in color_map):
						continue
					
					color = color_map[color_code]
					orig  = arrow_data[1:3]
					dest  = None if (len(arrow_data) != 5) else arrow_data[3:5]

					arrow.append(f"{orig}:{dest}:{color}")
		else:
			comment = None

		if id not in moves:	
			moves[id] = {
				"id"               : id,
				"move_number"      : db_move_num,
				"move"             : san,
				"fen"              : fen,
				"uci"              : move.uci(),
				"parent_id"        : parent_id,
				"transposition_id" : None,
				"note"             : comment,
				"arrow"            : None if len(arrow) == 0 else arrow
			}
		elif parent_id != None and moves[id]["parent_id"] != parent_id:
			moves[parent_id]["transposition_id"] = id

		for submove in move.variations:
			if submove.starts_variation() == False:
				continue

			readNode(submove, level + 1, id)
		
		readNode(move.next(), level, id)

	file = None if (len(sys.argv) != 3) else sys.argv[2]
	data = open(file)
	game = chess.pgn.read_game(data)

	for move in game.mainline():
		readNode(move)
		break

	data.close()
	print(json.dumps(moves))
except:
	print(False)