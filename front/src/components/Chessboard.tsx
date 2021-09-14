import React from "react";
import { Chessboard as CMChessboard, COLOR, MARKER_TYPE } from "cm-chessboard";

import "../styles/cm-chessboard.css";

interface ChessboardProps {
	orientation?: string,
	fen?: string,
	color?: string | boolean,
	onMove: Function
}

class Chessboard extends React.Component<ChessboardProps> {
	private board_ref = React.createRef<any>();

	private board: any;

	componentDidMount() {
		this.startup();
	}

	componentWillUnmount() {
		this.board?.destroy();
	}

	componentDidUpdate(prev_props: ChessboardProps) {
		if (this.props.orientation !== prev_props.orientation && prev_props.orientation && this.props.orientation) {
			this.board.setOrientation(COLOR[this.props.orientation]);
		}

		if (prev_props.fen !== this.props.fen && this.props.color !== false) {
			this.board.enableMoveInput(this.props.onMove, this.props.color);
		}
	}

	startup() {
		this.board = new CMChessboard(
			this.board_ref.current,
			{
				position    : "start",
				orientation : (this.props.orientation) ? COLOR[this.props.orientation] : COLOR.white,
				style       : {
					moveFromMarker: MARKER_TYPE.square,
					moveToMarker: MARKER_TYPE.square
				},
				sprite : {
					url : "/assets/chess/chessboard-sprite-staunty.svg"
				}
			}	
		);

		this.board.enableMoveInput(this.props.onMove, COLOR.white);
	}

	render() {
		return (
			<div id="chessboard" ref={this.board_ref}/>
		);
	}
}

export default Chessboard;