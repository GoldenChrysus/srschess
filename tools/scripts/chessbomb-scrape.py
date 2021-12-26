import json
import os.path
import requests
import chess
import chess.pgn
from os import path
from os import remove
from datetime import datetime

api_path  = "https://www.chessbomb.com/api/"
path      = "data/chessbomb/"
date_fmt  = "%Y-%m-%dT%H:%M:%S.%fZ"
headers   = {
	"Content-Type" : "application/json",
	"Accept"       : "application/json",
	"cookie"       : "_ga=GA1.2.1000128209.1637314987; cbs=eyJzZWNyZXQiOiJHcXltM0JhUmFjUloyVm5vVXhuMXVrU0oiLCJfZXhwaXJlIjoxNjQwNTcyNTc5NDc5LCJfbWF4QWdlIjoyNTkyMDAwMDAwfQ==; cbs.sig=PxH8jMwap1gTPjXiUnmwRCJ5sR0; _gid=GA1.2.1246786706.1638623389; _gat=1"
}
base_data = {
	"_csrf" : "2J01Heky-GHvq4achgU_SZWRdPxsRdIkveFU"
}

def getPage(after, attempt = 0):
	data = base_data

	if (after != None):
		data["after"] = after

	url = api_path + "index/main"
	res = requests.post(url = url, data = json.dumps(data), headers = headers)

	try:
		return res.json()
	except BaseException as e:
		if attempt == 3:
			raise e
		else:
			return getPage(after, attempt + 1)

def getRoom(slug, attempt = 0):
	data = base_data
	url  = api_path + "room/" + slug
	res  = requests.post(url = url, data = json.dumps(data), headers = headers)
	
	if (res.status_code == requests.codes.not_found or res.status_code == requests.codes.no_content):
		return False

	try:
		return res.json()
	except BaseException as e:
		if attempt == 3:
			raise e
		else:
			return getRoom(slug, attempt + 1)

def getGame(room_slug, round, game_slug, attempt = 0):
	data = base_data
	url  = api_path + "game/" + room_slug + "/" + round + "-" + game_slug
	res  = requests.post(url = url, data = json.dumps(data), headers = headers)

	if (res.status_code == requests.codes.not_found or res.status_code == requests.codes.no_content):
		return False

	try:
		return res.json()
	except BaseException as e:
		if attempt == 3:
			raise e
		else:
			return getGame(room_slug, round, game_slug, attempt + 1)

after     = None
last_run  = "2021-12-26T01:00:00.000Z";
last_run  = datetime.strptime(last_run, date_fmt)
valid_res = [
	"1/2-1/2",
	"1-0",
	"0-1"
]

with open(path + "state/latest.txt", "w+") as file:
	ended = False

	while (True):
		page = getPage(after)

		if (page["rooms"] == None or len(page["rooms"]) == 0):
			break

		for room in page["rooms"]:
			room      = getRoom(room["slug"])
			good_room = True

			if (room != False and
				datetime.strptime(room["room"]["updateAt"], date_fmt) <= last_run and
				datetime.strptime(room["room"]["endAt"], date_fmt) <= last_run):
				ended = True

				break

			if (room == False or room["games"] == None or len(room["games"]) == 0):
				continue
			
			room_path = path + "games/" + str(room["room"]["id"]) + ".pgn"

			with open(room_path, "w+") as pgn_file:
				pgn_file.truncate()

				exporter = chess.pgn.FileExporter(pgn_file)

				for game in room["games"]:
					if "?" in game["roundSlug"]:
						continue
					
					if game["result"] not in valid_res:
						continue

					game = getGame(room["room"]["slug"], game["roundSlug"], game["slug"])

					if (game == False or game["game"] == None):
						continue

					game_info = game["game"]
					pgn       = chess.pgn.Game()

					if "black" not in game_info or "white" not in game_info:
						continue

					print(room["room"]["slug"], game_info["roundSlug"], game_info["slug"])

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
						good_room = False

						break
				
				pgn_file.close()
			
			if good_room == False:
				remove(room_path)

			file.write(str(room["room"]["id"]) + " :: " + room["room"]["endAt"] + "\n")

		if ended == True or "more" not in page or page["more"] == None or len(page["more"]) == 0 or page["more"] == after:
			break
		
		after = page["more"]
	
	file.close()