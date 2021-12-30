import json
import os.path
import requests
import chess
import chess.pgn
from os import path
from os import remove
from datetime import datetime

api_path  = "https://www.365chess.com/download.php?ec="
path      = "data/365chess/games/"
headers   = {
	"Referer" : "https://www.365chess.com/eco/D38",
	"Cookie"  : "PHPSESSID=9vtusrtmkfr9hadg0om38a5jr4; _ga=GA1.2.1332592507.1640667557; _gid=GA1.2.168866756.1640827415; sr1=view:result1; 365user[user]=Chrysus; 365user[pass]=65cadd001ef6d239f608cba20d33509c; _gat_gtag_UA_2426888_1=1"
}

def downloadPGN(code):
	res = requests.post(url = api_path + code, headers = headers).content

	if (len(res) == 0):
		raise Exception("bad data: " + code)

	return res

for letter in range(ord("A"), ord("E") + 1):
	for i in range(0, 99 + 1):
		code = chr(letter) + (str(i).zfill(2))
		pgn  = downloadPGN(code)

		with open(path + code + ".pgn", "wb+") as file:
			file.write(pgn)
			file.close()