import React from "react";
import { Chessboard as CMChessboard, COLOR, MARKER_TYPE, INPUT_EVENT_TYPE } from "cm-chessboard";
import Chess, { ChessInstance } from "chess.js";

import "../styles/cm-chessboard.css";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

interface ChessboardProps {
	orientation?: string,
	fen?: string,
	color?: string | boolean,
	onMove: Function,
	check_coord?: string
}

class Chessboard extends React.Component<ChessboardProps> {
	private board_ref    = React.createRef<any>();
	private chess        = Chess2();
	private fen?: string = "start";

	private board: any;

	constructor(props: ChessboardProps) {
		super(props);

		this.onMove = this.onMove.bind(this);
	}

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

		if (this.props.fen !== this.fen) {
			this.fen = this.props.fen || "start";

			this.chess.load(this.fen);
			this.board.setPosition(this.props.fen);
			this.toggleMoveInput();
		}
	}

	startup() {
		this.board = new CMChessboard(
			this.board_ref.current,
			{
				position    : "start",
				orientation : (this.props.orientation) ? COLOR[this.props.orientation] : COLOR.white,
				style       : {
					moveFromMarker : MARKER_TYPE.square,
					moveToMarker   : MARKER_TYPE.square
				},
				sprite : {
					url : "/assets/chess/chessboard-sprite-staunty.svg"
				}
			}	
		);

		this.board.enableMoveInput(this.onMove, COLOR.white);
	}

	render() {
		return (
			<div id="chessboard" ref={this.board_ref} style={{overflow: 'hidden'}}/>
		);
	}

	onMove(event: any) {
		event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot);
		event.chessboard.removeMarkers(undefined, MARKER_TYPE.square);
	
		switch (event.type) {
			case INPUT_EVENT_TYPE.moveStart:
				const moves = this.chess.moves({square: event.square, verbose: true});
	
				event.chessboard.addMarker(event.square, MARKER_TYPE.square);
	
				for (const move of moves) {
					event.chessboard.addMarker(move.to, MARKER_TYPE.dot);
				}
	
				return (moves.length > 0);
	
			case INPUT_EVENT_TYPE.moveDone:
				event.chessboard.disableMoveInput();

				const move = {from: event.squareFrom, to: event.squareTo};
				const res  = this.chess.move(move);
	
				if (!res) {
					return res;
				}

				this.fen = this.chess.fen();
	
				event.chessboard.removeMarkers(undefined, MARKER_TYPE.frame);
				event.chessboard.addMarker(event.squareFrom, MARKER_TYPE.square);
				event.chessboard.setPosition(this.fen);
				this.toggleMoveInput();

				this.props.onMove({
					type  : "move",
					data  : {
						fen   : this.fen,
						moves : this.chess.history(),
					}
				});
	
				break;
	
			default:
				break;
		}
	}
	
	toggleMoveInput() {
		const over = this.chess.game_over();

		if (over) {
			this.board.disableMoveInput();
		} else {
			const color = COLOR[(this.chess.turn() === "w") ? "white" : "black"];

			this.board.enableMoveInput(this.onMove, color);
		}
	}

	handleCheck(next_color: string) {
		this.board.removeMarkers(undefined, MARKER_TYPE.frame);

		if (this.chess.in_check()) {
			const board = this.chess.board();

			let king_coord;

			for (const rank_idx in board) {
				const rank = board[rank_idx];

				if (king_coord) {
					break;
				}

				for (const file_idx in rank) {
					const file = rank[file_idx];

					if (file?.color === next_color && file?.type === "k") {
						const rank  = 8 - +rank_idx;
						const file  = (Array.from({ length: 8 }, (_, i) => String.fromCharCode("a".charCodeAt(0) + i)))[+file_idx];
						
						king_coord = file + rank;

						break;
					}
				}
			}

			this.board.addMarker(king_coord, MARKER_TYPE.frame);
		}
	}
}

export default Chessboard;