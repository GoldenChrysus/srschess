import { makeAutoObservable } from "mobx";
import { RepertoireRouteRepertoire } from "../lib/types/RepertoireRouteTypes";

interface ChessStateTypes {
	repertoire: RepertoireRouteRepertoire
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