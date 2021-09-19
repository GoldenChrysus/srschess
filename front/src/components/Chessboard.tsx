import React from "react";
import Chessground from "react-chessground";
import Chess, { ChessInstance } from "chess.js";

import Piece from "./chess/Piece";

import "react-chessground/dist/styles/chessground.css";
import "../styles/chess/chessboard.css";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

interface ChessboardProps {
	orientation?: string,
	fen?: string,
	pgn?: string,
	onMove: Function,
}

class Chessboard extends React.Component<ChessboardProps> {
	private board_ref    = React.createRef<any>();
	private chess        = Chess2();
	private fen?: string = "start";
	private pgn?: string = "";

	constructor(props: ChessboardProps) {
		super(props);

		this.onMove    = this.onMove.bind(this);
		this.sizeBoard = this.sizeBoard.bind(this);
	}

	componentDidMount() {
		this.sizeBoard();
		window.addEventListener("resize", this.sizeBoard);
	}

	shouldComponentUpdate(next_props: ChessboardProps) {
		if (this.props.fen !== next_props.fen) {
			this.fen = next_props.fen || "start";
			this.pgn = next_props.pgn || "start";

			this.chess.load(this.fen);
			this.chess.load_pgn(this.pgn);
			return true;
		}

		if (next_props.pgn !== this.props.pgn) {
			this.pgn = next_props.pgn || "start";

			this.chess.load_pgn(this.pgn);
			return true;
		}

		return (next_props.orientation !== this.props.orientation);
	}

	render() {
		return (
			<>
				<div className="piece-store w-full" style={{ height: "25px" }}>
					{this.renderCaptures("top")}
				</div>
				<Chessground
					check={this.checkColor()}
					orientation={this.props.orientation || "white"}
					turnColor={this.toColor()}
					movable={this.toDests()}
					fen={this.props.fen}
					lastMove={this.lastMove()}
					onMove={this.onMove}
					ref={this.board_ref}
				/>
				<div className="piece-store w-full" style={{ height: "25px" }}>
					{this.renderCaptures("bottom")}
				</div>
			</>
		);
	}

	sizeBoard() {
		if (!this.board_ref.current) {
			return;
		}

		const board  = this.board_ref.current.el;
		const parent = board.closest(".order-1");
		const width  = Math.min(parent.offsetHeight- 50, parent.offsetWidth) + "px";

		for (const child of parent.children) {
			child.style.width = width;

			if (child.classList.contains("cg-wrap")) {
				child.style.height = width;
			}
		}
	}

	lastMove() {
		const history = this.chess.history({ verbose: true });

		return (history.length)
			? [history.at(-1)?.from, history.at(-1)?.to]
			: null;
	}

	onMove(orig: any, dest: any) {
		const res = this.chess.move({
			from : orig,
			to   : dest
		});

		if (!res) {
			this.chess.undo();
			return false;
		}

		this.fen = this.chess.fen();
		this.pgn = this.chess.pgn();

		this.props.onMove({
			type  : "move",
			data  : {
				fen   : this.fen,
				pgn   : this.pgn,
				moves : this.chess.history(),
			}
		});	
	}
	
	toColor() {
		return (this.chess.turn() === "w") ? "white" : "black";
	}

	checkColor() {
		return (this.chess.in_check())
			? this.toColor()
			: "";
	}

	toDests() {
		const dests = new Map();

		this.chess.SQUARES.forEach(s => {
			const ms = this.chess.moves({
				square  : s,
				verbose : true
			});

			if (ms.length) {
				dests.set(s, ms.map(m => m.to));
			}
		});

		return {
			free: false,
			dests: dests
		};
	}

	renderCaptures(section: string) {
		const player = ((this.props.orientation === "white" && section === "bottom") || (this.props.orientation === "black" && section === "top"))
			? "w"
			: "b";
		const moves  = this.chess.history({ verbose: true });
		const pieces = [];

		for (let i in moves) {
			if (moves[i].color !== player) {
				continue;
			}

			if (moves[i].captured) {
				pieces.push(
					<Piece key={"captures-" + player + "-" + i} type={moves[i].captured!} color={(player === "w") ? "black" : "white"}/>
				)
			}
		}

		return pieces;
	}
}

export default Chessboard;