import React, { useReducer } from "react";
import { useObserver } from "mobx-react";
import Chess, { ChessInstance } from "chess.js";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

enum ChessControllerModes {
	repertoire = "repertoire"
}

interface ChessControllerProps {
	mode         : keyof typeof ChessControllerModes,
	repertoire?  : any,
	repertoires? : Array<any>
	moves?       : Array<any>
}

interface ChessControllerState {
	chess      : ChessInstance,
	tree       : any,
	tree_moves : any,
	moves      : Array<any[]>
}

function ChessController(props: ChessControllerProps) {
	let data = "";

	switch (props.mode) {
		case ChessControllerModes.repertoire:
			data = "repertoire";

			break;
		
		default:
			data = "none";

			break;
	}

	return (
		<div className="flex flex-wrap gap-x-8">
			<div className="flex-1 order-2 md:order-1">
				{props.repertoire?.id}
			</div>
			<div className="flow-grow-0 order-1 md:order-2">

			</div>
		</div>
	);
}

export default ChessController;