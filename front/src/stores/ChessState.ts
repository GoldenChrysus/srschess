import { makeAutoObservable } from "mobx";
import { RepertoireModel, RepertoireMoveModel } from "../lib/types/models/Repertoire";

class ChessState {
	best_move: string = "";

	// Moves
	move_id: RepertoireMoveModel["id"] | null = null;

	// Repertoires
	repertoire?: RepertoireModel | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setBestMove(uci: string) {
		this.best_move = uci;
	}

	setRepertoire(repertoire?: RepertoireModel | null) {
		this.repertoire = repertoire;
	}
}

export default new ChessState();