import { ApolloClient } from "@apollo/client";
import Chess, { ChessInstance } from "chess.js";
import { START_FEN } from "../constants/chess";
import { RepertoireModel } from "./models/Repertoire";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

export interface ChessControllerHistoryItem {
	id: number | string,
	move: string
}

export enum ChessControllerModes {
	repertoire = "repertoire",
	review     = "review",
	lesson     = "lesson",
	openings   = "opening",
	database   = "database",
}

export interface ChessControllerProps {
	mode            : keyof typeof ChessControllerModes,
	repertoire?     : RepertoireModel,
	repertoires?    : Array<RepertoireModel>,
	client          : ApolloClient<object>,
	onMove          : Function,
	onTransposition : Function,
	onReview        : Function,
	arrows          : { [key: string]: Array<any> }
}

export interface ChessControllerState {
	fen           : string,
	pgn           : string,
	last_num      : number,
	last_uuid     : string | null,
	last_is_new?  : boolean,
	moves         : Array<string>,
	history       : Array<ChessControllerHistoryItem>,
	queue_index   : number,
	preloading    : boolean,
	quizzing      : boolean,
	awaiting_user : boolean
}

export const initial_state: ChessControllerState = {
	fen           : START_FEN,
	pgn           : "",
	last_num      : 5,
	last_uuid     : null,
	moves         : [],
	history       : [],
	queue_index   : 0,
	preloading    : false,
	quizzing      : false,
	awaiting_user : true
};