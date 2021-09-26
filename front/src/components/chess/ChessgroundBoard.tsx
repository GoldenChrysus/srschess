import React from "react";
import { observer } from "mobx-react";
import Chessground from "react-chessground";

import ChessState from "../../stores/ChessState";

interface ChessgroundProps {
	check: string,
	orientation: string,
	turn_color: string,
	movable: any,
	fen?: string,
	last_move?: Array<any> | null,
	onMove: Function,
	drawable: any
}

class ChessgroundBoard extends React.PureComponent<ChessgroundProps> {
	private board_ref = React.createRef<any>();

	constructor(props: ChessgroundProps) {
		super(props);

		this.sizeBoard = this.sizeBoard.bind(this);
	}

	componentDidMount() {
		this.sizeBoard();
		window.addEventListener("resize", this.sizeBoard);
	}

	render() {
		const drawable = JSON.parse(JSON.stringify(this.props.drawable));

		if (ChessState.best_move) {
			drawable.autoShapes.push({
				brush   : "bestMove",
				orig    : ChessState.best_move.substring(0, 2),
				mouseSq : ChessState.best_move.substring(2, 4),
				dest    : ChessState.best_move.substring(2, 4),
			});
		}

		return (
			<Chessground
				check={this.props.check}
				orientation={this.props.orientation}
				turnColor={this.props.turn_color}
				movable={this.props.movable}
				fen={this.props.fen}
				lastMove={this.props.last_move}
				onMove={this.props.onMove}
				drawable={drawable}
				ref={this.board_ref}
			/>
		);
	}

	sizeBoard() {
		if (!this.board_ref.current) {
			return;
		}

		const board    = this.board_ref.current.el;
		const parent   = board.closest(".order-1");
		const width    = Math.min(parent.offsetHeight- 50, parent.offsetWidth) + "px";
		const movelist = document.getElementById("movelist");

		for (const child of parent.children) {
			child.style.width = width;

			if (child.classList.contains("cg-wrap")) {
				child.style.height = width;
			}
		}

		if (movelist) {
			movelist.style.maxHeight = width;
		}
	}
}

export default observer(ChessgroundBoard);