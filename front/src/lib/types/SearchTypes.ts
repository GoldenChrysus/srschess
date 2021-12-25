import { ChessControllerProps } from "./ChessControllerTypes";

export enum SearchModes {
	repertoires = "repertoires",
	master_games = "master_games"
}

export interface SearchProps {
	mode: keyof typeof SearchModes,
	movelist: string,
	record?: ChessControllerProps["game"] | ChessControllerProps["repertoire"],
	onMoveSearchChange?: Function
}

export interface SearchCriteria {
	mode: SearchProps["mode"],
	data: {
		movelist?: string,
		fen?: string,
		eco?: string,
		side?: string
	}
}

export interface SearchState {
	criteria?: SearchCriteria
}