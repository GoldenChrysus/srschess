import React from "react";

enum ChessControllerModes {
	repertoire
};

interface ChessControllerProps {
	mode        : keyof typeof ChessControllerModes,
	repertoire? : any
};

class ChessController extends React.Component<ChessControllerProps> {
	render() {
		return "";
	}
}

export default ChessController;