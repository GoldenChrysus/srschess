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
	repertoires? : Array<any>
	moves?       : Array<any>
}

export interface ChessControllerState {
	chess : ChessInstance,
	fen   : string,
	color : string | boolean,
	moves : Array<string>
}

export const initial_state: ChessControllerState = {
	chess : Chess2(),
	fen   : "start",
	color : COLOR.white,
	moves : []
};