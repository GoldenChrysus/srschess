import Chess, { ChessInstance } from "chess.js";

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
	chess      : ChessInstance,
	tree       : any,
	tree_moves : any,
	moves      : Array<any[]>
}

export const initial_state: ChessControllerState = {
	chess      : Chess2(),
	tree       : {},
	tree_moves : {},
	moves      : []
};