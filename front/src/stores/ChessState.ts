import { makeAutoObservable } from "mobx";
import { RepertoireModel } from "../lib/types/models/Repertoire";

class ChessState {
	best_move: string = "";

	constructor() {
		makeAutoObservable(this);
	}

	setBestMove(uci: string) {
		this.best_move = uci;
	}
}

export default new ChessState();