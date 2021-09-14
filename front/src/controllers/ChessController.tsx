import React, { useReducer } from "react";
import { useObserver } from "mobx-react";
import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";

function ChessController(props: ChessControllerProps) {
	const [state, dispatch] = useReducer(reducer, initial_state);

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

function reducer(state: ChessControllerState, action: any) {
	return state;
}

export default ChessController;