import React from "react";
import { observer } from "mobx-react";
import { BaseStore } from "../../../api/stores";

enum ChessControllerModes {
	repertoire = "repertoire"
}

interface ChessControllerProps {
	mode         : keyof typeof ChessControllerModes,
	repertoire?  : any,
	repertoires? : BaseStore
}

class ChessController extends React.Component<ChessControllerProps> {
	render() {
		switch (this.props.mode) {
			case ChessControllerModes.repertoire:
				return "";
			
			default:
				return "";
		}
	}
}

export default observer(ChessController);