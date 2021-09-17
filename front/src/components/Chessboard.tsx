import React from "react";
import { Chessboard as CMChessboard, COLOR, MARKER_TYPE } from "cm-chessboard";

import "../styles/cm-chessboard.css";

interface ChessboardProps {
	orientation?: string,
	fen?: string,
	color?: string | boolean,
	onMove: Function,
	check_coord?: string
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

		if (prev_props.fen !== this.props.fen) {
			this.board.setPosition(this.props.fen);

			if (this.props.color !== false) {
				this.board.enableMoveInput(this.props.onMove, this.props.color);
			}
		}

		if (prev_props.check_coord !== this.props.check_coord) {
			this.board.removeMarkers(undefined, MARKER_TYPE.frame);
			
			if (this.props.check_coord) {
				this.board.addMarker(this.props.check_coord, MARKER_TYPE.frame);
			}
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
			<div id="chessboard" ref={this.board_ref} style={{overflow: 'hidden'}}/>
		);
	}
}

export default Chessboard;