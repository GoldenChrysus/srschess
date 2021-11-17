export enum SearchModes {
	repertoires = "repertoires",
	master_games = "master_games"
}

export interface SearchProps {
	mode: keyof typeof SearchModes
}

export interface SearchState {
	criteria: any
}