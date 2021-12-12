import { makeAutoObservable } from "mobx";
import { CollectionModel } from "../lib/types/models/Collection";
import { RepertoireModel, RepertoireMoveModel } from "../lib/types/models/Repertoire";

class ChessState {
	best_move: string = "";
	transposing: boolean = false;

	// Moves
	move_id: RepertoireMoveModel["id"] | null = null;

	// Repertoires
	repertoire?: RepertoireModel | null = null;

	// Collections
	collection?: CollectionModel | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setBestMove(uci: string) {
		this.best_move = uci;
	}

	setRepertoire(repertoire?: RepertoireModel | null) {
		this.repertoire = repertoire;
	}

	setCollection(collection?: CollectionModel | null) {
		this.collection = collection;
	}
}

export default new ChessState();