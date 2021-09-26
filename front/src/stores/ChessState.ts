import { makeAutoObservable } from "mobx";

interface ChessStateTypes {
	repertoire: { [key: string]: any }
}

class ChessState {
	repertoire: ChessStateTypes["repertoire"] = {};
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