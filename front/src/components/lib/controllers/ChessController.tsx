import React from "react";
import { observer } from "mobx-react";
import { BaseStore } from "../../../api/stores";

enum ChessControllerModes {
	repertoire
};

interface ChessControllerProps {
	mode         : keyof typeof ChessControllerModes,
	repertoire?  : any,
	repertoires? : BaseStore
};

class ChessController extends React.Component<ChessControllerProps> {
	render() {
		return "";
	}
}

export default observer(ChessController);