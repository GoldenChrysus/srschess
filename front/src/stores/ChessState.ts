import { makeAutoObservable } from "mobx";
import { RepertoireModel } from "../lib/types/models/Repertoire";

interface ChessStateTypes {
	repertoire: RepertoireModel
}

class ChessState {
	repertoire: ChessStateTypes["repertoire"] = {
		id   : 0,
		name : "",
		side : ""
	};
	best_move: string = "";

	constructor() {
		makeAutoObservable(this);
	}

	setRepertoire(repertoire: ChessStateTypes["repertoire"]) {
		this.repertoire = repertoire;
	}

	setBestMove(uci: string) {
		this.best_move = uci;
	}
}

export default new ChessState();