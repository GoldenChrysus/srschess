import React from "react";
import { observer } from "mobx-react";

enum ChessControllerModes {
	repertoire = "repertoire"
}

interface ChessControllerProps {
	mode         : keyof typeof ChessControllerModes,
	repertoire?  : any,
	repertoires? : Array<any>
	moves?       : Array<any>
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
		<div>{props.repertoire?.id}</div>
	);
}

export default ChessController;