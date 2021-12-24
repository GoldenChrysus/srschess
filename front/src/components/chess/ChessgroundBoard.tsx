import React from "react";
import { observer } from "mobx-react";
import Chessground from "react-chessground";

import ChessState from "../../stores/ChessState";
import { ChessControllerProps } from "../../lib/types/ChessControllerTypes";

interface ChessgroundProps {
	mode: ChessControllerProps["mode"],
	check: string,
	orientation: string,
	turn_color: string,
	movable: { free: boolean, dests: Map<string, Array<string>> },
	fen?: string,
	last_move: Array<string> | null,
	onMove: Function,
	drawable: any
}

class ChessgroundBoard extends React.PureComponent<ChessgroundProps> {
	private board_ref = React.createRef<typeof Chessground>();

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
				viewOnly={this.props.mode === "static"}
				coordinates={this.props.mode !== "static"}
			/>
		);
	}

	sizeBoard() {
		if (!this.board_ref.current) {
			return;
		}

		const board    = this.board_ref.current.el;
		const parent   = board.closest("#chessboard-outer") ?? board.closest(".board-100w") ?? document;
		const width    = (parent.classList.contains("board-100w"))
			? parent.offsetWidth + "px"
			: Math.min(parent.offsetHeight - 50, parent.offsetWidth) + "px";
		const movelist = document.getElementById("movelist");

		for (const child of parent.children) {
			child.style.width = width;

			if (child.classList.contains("cg-wrap")) {
				child.style.height = width;
			}
		}

		if (movelist) {
			let move_height = width;

			const stockfish  = document.getElementById("stockfish")?.offsetHeight ?? 0;
			const controller = document.getElementById("controller")?.offsetHeight ?? 0;
			let adjust_px    = stockfish + controller;

			if (movelist.classList.contains("repertoire")) {
				const collapse: any   = document.getElementById("chess-right-menu")?.getElementsByClassName("ant-collapse")[0];
				const collapse_height = collapse?.offsetHeight ?? 0;

				adjust_px += collapse_height;
			}

			adjust_px  += 7;
			move_height = "calc(" + move_height + " - " + adjust_px + "px)";

			movelist.style.maxHeight = move_height;
		}
	}
}

export default observer(ChessgroundBoard);