import User from "./lib/User";
import Repertoire from "./lib/Repertoire";
import Move from "./lib/Move";

interface ModelMap {
	[key: string]: any
}

interface ClassMap {
	[key: string]: string
}

const map: ModelMap = {
	User,
	Repertoire,
	Move
};

const classes: ClassMap = {}

for (let key in map) {
	classes[map[key].type] = key;
}

export {
	User,
	Repertoire,
	Move,
	map,
	classes
};