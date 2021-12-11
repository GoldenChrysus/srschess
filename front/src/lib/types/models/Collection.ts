import { UserModel } from "./User";

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

export interface CollectionModel {
	id: number,
	slug?: string,
	name: string,
	side: string,
	public: boolean,
	games?: Array<GameModel> | null,
	user?: UserModel,
}

export interface CollectionQueryData {
	collection: CollectionModel | null
}

export interface CollectionsQueryData {
	collections: Array<CollectionModel>
}