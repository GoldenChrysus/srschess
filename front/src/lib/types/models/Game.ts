export interface GameMoveNoteModel {
	id: string,
	value: string | null
}

export interface GameMoveModel {
	id: string,
	ply: number,
	move: string,
	fen: string,
	uci: string | null
}

export interface GameModel {
	id: string,
	date: string,
	pgn: string,
	movelist: string,
	source: string,
	moves?: Array<GameMoveModel> | null
}