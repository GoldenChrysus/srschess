# apt-get install python3-pip
# python3 -m pip install beautifulsoup4
import requests
import re
from bs4 import BeautifulSoup
import urllib.request
from os import listdir
from os import rename
from os import remove
from os.path import isfile, join
from zipfile import ZipFile

path  = "data/pgnmentor/"
rails = "../../api/data/pgnmentor/"
url   = "https://www.pgnmentor.com/"
page  = requests.get(url + "files.html")
html  = BeautifulSoup(page.content, "html.parser")
links = html.find_all("a", string=re.compile("pgn$"))

for link in links:
	href = link["href"]

	if (re.compile("\.(pgn|zip)$").match(href) == False):
		continue

	link = url + href
	name = href.split("/")[1]

	urllib.request.urlretrieve(link, path + name)

files = [file for file in listdir(path) if isfile(join(path, file))]

for file in files:
	if (len(re.findall("zip$", file)) > 0):
		with ZipFile(path + file, "r") as zip:
			zip.extractall(path)
		remove(path + file)

files = [file for file in listdir(path) if isfile(join(path, file))]

for file in files:
	print(file)
	if (len(re.findall("pgn$", file)) == 0):
		continue
	
	rename(path + file, rails + file)