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
	moves?       : {
		[id: string]: {
			[key: string] : any
		}
	},
	tree?        : {
		[move_num: number] : {
			[sort: number] : {
				[key: string | number] : any
			}
		}
	},
	onMove : Function
}

export interface ChessControllerState {
	fen          : string,
	pgn          : string,
	last_uuid    : string | null,
	last_is_new? : boolean,
	moves        : Array<string>,
}

export const initial_state: ChessControllerState = {
	fen       : "start",
	pgn       : "",
	last_uuid : null,
	moves     : []
};