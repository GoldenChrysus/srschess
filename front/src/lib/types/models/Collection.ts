import { UserModel } from "./User";
import { GameModel } from "./Game";

export interface CollectionModel {
	id: number,
	slug?: string,
	name: string,
	side: string,
	public: boolean,
	games?: Array<GameModel> | null,
	user?: UserModel
}

export interface CollectionQueryData {
	collection: CollectionModel | null
}

export interface CollectionsQueryData {
	collections: Array<CollectionModel>
}