import Chess, { ChessInstance } from "chess.js";
import { START_FEN } from "../constants/chess";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

export enum ChessControllerModes {
	repertoire = "repertoire",
	review     = "review",
	lesson     = "lesson",
	openings   = "opening",
	database   = "database",
}

export interface ChessControllerProps {
	mode            : keyof typeof ChessControllerModes,
	repertoire?     : any,
	repertoires?    : Array<any>,
	client          : any,
	onMove          : Function,
	onTransposition : Function,
	arrows          : { [key: string]: Array<any> }
}

export interface ChessControllerState {
	fen          : string,
	pgn          : string,
	last_num     : number,
	last_uuid    : string | null,
	last_is_new? : boolean,
	moves        : Array<string>,
	history      : Array<any>,
	queue_index  : number,
	preloading   : boolean
}

export const initial_state: ChessControllerState = {
	fen         : START_FEN,
	pgn         : "",
	last_num    : 10,
	last_uuid   : null,
	moves       : [],
	history     : [],
	queue_index : 0,
	preloading  : true
};