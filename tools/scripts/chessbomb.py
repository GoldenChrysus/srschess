import json
import os.path
import requests
import chess
import chess.pgn
from os import path
from os import remove

api_path  = "https://www.chessbomb.com/api/"
path      = "data/chessbomb/"
headers   = {
	"Content-Type" : "application/json",
	"Accept"       : "application/json",
	"cookie"       : "_ga=GA1.2.1044528119.1630747170; cookieconsent_dismissed=yes; _gid=GA1.2.217649908.1632188507; cbs=eyJzZWNyZXQiOiJaUjk0YXBuZ1ZFOU05SW91RTU4ZTkyWV8iLCJwYXNzcG9ydCI6eyJ1c2VyIjo1OTAwNH0sIl9leHBpcmUiOjE2MzQ3ODA2OTQ2MDgsIl9tYXhBZ2UiOjI1OTIwMDAwMDB9; cbs.sig=NjpoGyxBifwfSLzTmxD5h82K2-U; _gat=1"
}
base_data = {
	"_csrf" : "ulI0kEd3-X2DeNpJEEadbaMXCM-krVdc-xhQ"
}

def getPage(after):
	data = base_data

	if (after != None):
		data["after"] = after

	url = api_path + "index/main"
	res = requests.post(url = url, data = json.dumps(data), headers = headers)

	return res.json()

def getRoom(slug):
	data = base_data
	url  = api_path + "room/" + slug
	res  = requests.post(url = url, data = json.dumps(data), headers = headers)
	
	if (res.status_code == requests.codes.not_found or res.status_code == requests.codes.no_content):
		return False

	return res.json()

def getGame(room_slug, round, game_slug):
	data = base_data
	url  = api_path + "game/" + room_slug + "/" + round + "-" + game_slug
	res  = requests.post(url = url, data = json.dumps(data), headers = headers)

	if (res.status_code == requests.codes.not_found or res.status_code == requests.codes.no_content):
		return False

	return res.json()

# after = None
after = [
	"2021-08-20T20:55:00.000Z",
	5660
]

with open(path + "state/latest.txt", "w+") as file:
	while (True):
		page = getPage(after)

		if (page["rooms"] == None or len(page["rooms"]) == 0):
			break

		for room in page["rooms"]:
			room = getRoom(room["slug"])
			good = True

			if (room == False or room["games"] == None or len(room["games"]) == 0):
				continue
			
			room_path = path + "games/" + str(room["room"]["id"]) + ".pgn"

			with open(room_path, "w+") as pgn_file:
				pgn_file.truncate()

				exporter = chess.pgn.FileExporter(pgn_file)

				for game in room["games"]:
					if "?" in game["roundSlug"]:
						continue

					print(room["room"]["slug"], game["roundSlug"], game["slug"])
					game = getGame(room["room"]["slug"], game["roundSlug"], game["slug"])

					if (game == False or game["game"] == None):
						continue

					game_info = game["game"]
					pgn       = chess.pgn.Game()

					pgn.headers["Event"]      = room["room"]["name"]
					pgn.headers["Date"]       = room["room"]["startAt"]
					pgn.headers["Round"]      = game_info["roundSlug"]
					pgn.headers["ID"]         = str(game_info["id"])
					pgn.headers["Result"]     = game_info["result"]
					pgn.headers["White"]      = game_info["white"]["name"]
					pgn.headers["WhiteFIDE"]  = str(0 if "fideId" not in game_info["white"] else game_info["white"]["fideId"])
					pgn.headers["WhiteElo"]   = str(0 if "whiteElo" not in game_info else game_info["whiteElo"])
					pgn.headers["WhiteTitle"] = str(None if "title" not in game_info["white"] else game_info["white"]["title"])
					pgn.headers["Black"]      = game_info["black"]["name"]
					pgn.headers["BlackFIDE"]  = str(0 if "fideId" not in game_info["black"] else game_info["black"]["fideId"])
					pgn.headers["BlackElo"]   = str(0 if "blackElo" not in game_info else game_info["blackElo"])
					pgn.headers["BlackTitle"] = str(None if "title" not in game_info["black"] else game_info["black"]["title"])

					try:
						moves = []

						for move in game["moves"]:
							uci = move["cbn"].split("_")[0]

							moves.append(chess.Move.from_uci(uci))

						pgn.add_line(moves)
						pgn.accept(exporter)
					except:
						good = False

						break
				
				pgn_file.close()
			
			if good == False:
				remove(room_path)

			file.truncate()
			file.write(str(room["room"]["id"]) + " :: " + room["room"]["endAt"] + "\n")

		if "more" not in page or page["more"] == None or len(page["more"]) == 0 or page["more"] == after:
			break
		
		after = page["more"]
	
	file.close()