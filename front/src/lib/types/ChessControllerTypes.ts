import Chess, { ChessInstance } from "chess.js";
import { COLOR } from "cm-chessboard";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

export enum ChessControllerModes {
	repertoire = "repertoire"
}

export interface ChessControllerProps {
	mode         : keyof typeof ChessControllerModes,
	repertoire?  : any,
	repertoires? : Array<any>,
	client       : any,
	onMove       : Function
}

export interface ChessControllerState {
	fen          : string,
	pgn          : string,
	last_num     : number,
	last_uuid    : string | null,
	last_is_new? : boolean,
	moves        : Array<string>,
	history      : Array<any>
}

export const initial_state: ChessControllerState = {
	fen       : "start",
	pgn       : "",
	last_num  : 10,
	last_uuid : null,
	moves     : [],
	history   : [],
};