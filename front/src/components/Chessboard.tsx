import React from "react";
import Chess, { ChessInstance } from "chess.js";

import { ChessControllerProps } from "../lib/types/ChessControllerTypes";
import { START_FEN } from "../lib/constants/chess";
import ChessgroundBoard from "./chess/ChessgroundBoard";
import Piece from "./chess/Piece";

import "react-chessground/dist/styles/chessground.css";
import "../styles/chess/chessboard.css";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

interface ChessboardProps {
	mode: ChessControllerProps["mode"],
	repertoire_id?: number,
	orientation?: string,
	fen?: string,
	pgn?: string,
	onMove: Function,
	children: Array<any>
	queue_item: { [key: string] : any } | undefined | null
}

class Chessboard extends React.Component<ChessboardProps> {
	private chess        = Chess2();
	private fen?: string = START_FEN;
	private pgn?: string = "";

	constructor(props: ChessboardProps) {
		super(props);

		this.onMove = this.onMove.bind(this);
		this.onDraw = this.onDraw.bind(this);
	}

	shouldComponentUpdate(next_props: ChessboardProps) {
		if (this.props.fen !== next_props.fen) {
			this.fen = next_props.fen || START_FEN;
			this.pgn = next_props.pgn || START_FEN;

			this.chess.load(this.fen);
			this.chess.load_pgn(this.pgn);
			return true;
		}

		if (next_props.pgn !== this.props.pgn) {
			this.pgn = next_props.pgn || START_FEN;

			this.chess.load_pgn(this.pgn);
			return true;
		}

		return (
			next_props.orientation !== this.props.orientation ||
			next_props.repertoire_id !== this.props.repertoire_id ||
			next_props.queue_item?.id !== this.props.queue_item?.id ||
			next_props.mode !== this.props.mode
		);
	}

	render() {
		const drawable: any = {
			autoShapes : [],
			onChange   : this.onDraw,
			brushes: {
				green     : { key: "g", color: "#15781B", opacity: 1, lineWidth: 10 },
				red       : { key: "r", color: "#882020", opacity: 1, lineWidth: 10 },
				blue      : { key: "b", color: "#003088", opacity: 1, lineWidth: 10 },
				yellow    : { key: "y", color: "#e68f00", opacity: 1, lineWidth: 10 },
				paleBlue  : { key: "pb", color: "#003088", opacity: 0.4, lineWidth: 15 },
				paleGreen : { key: "pg", color: "#15781B", opacity: 0.4, lineWidth: 15 },
				paleRed   : { key: "pr", color: "#882020", opacity: 0.4, lineWidth: 15 },
				paleGrey  : { key: "pgr", color: "#4a4a4a", opacity: 0.35, lineWidth: 15 },
				nextMove  : { key: "m", color: "#800080", opacity: 0.5, linewidth: 10 },
				bestMove  : { key: "bm", color: "#a52a2a", opacity: 0.7, linewidth: 10 },
				queueMove : { key: "qm", color: "#ffff00", opacity: 0.7, linewidth: 10 }
			},
		};

		switch (this.props.mode) {
			case "repertoire":
				for (const uci of this.props.children) {
					drawable.autoShapes.push({
						brush   : "nextMove",
						orig    : uci.slice(0, 2),
						mouseSq : uci.slice(2, 4),
						dest    : uci.slice(2, 4),
					});
				}

				break;

			case "lesson":
				if (!this.props.queue_item) {
					break;
				}

				drawable.autoShapes.push({
					brush   : "queueMove",
					orig    : this.props.queue_item.uci.slice(0, 2),
					mouseSq : this.props.queue_item.uci.slice(2, 4),
					dest    : this.props.queue_item.uci.slice(2, 4),
				});
				break;
		}

		return (
			<>
				<div className="piece-store w-full" style={{ height: "25px" }}>
					{this.renderCaptures("top")}
				</div>
				<ChessgroundBoard
					check={this.checkColor()}
					orientation={this.props.orientation || "white"}
					turn_color={this.toColor()}
					movable={this.toDests()}
					fen={this.props.fen}
					last_move={this.lastMove()}
					onMove={this.onMove}
					drawable={drawable}
				/>
				<div className="piece-store w-full" style={{ height: "25px" }}>
					{this.renderCaptures("bottom")}
				</div>
			</>
		);
	}

	lastMove() {
		const history   = this.chess.history({ verbose: true });
		const last_item = (history.length) ? history.at(-1) : null;

		return (last_item)
			? [last_item.from, last_item.to]
			: null;
	}

	onMove(orig: any, dest: any) {
		if (!this.props.orientation) {
			return false;
		}

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
			type  : "move-" + this.props.mode,
			uci   : orig + dest,
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
		
		switch (this.props.mode) {
			case "repertoire":
				if (this.props.orientation) {
					this.chess.SQUARES.forEach(s => {
						const ms = this.chess.moves({
							square  : s,
							verbose : true
						});

						if (ms.length) {
							dests.set(s, ms.map(m => m.to));
						}
					});
				}

				break;

			case "lesson":
				if (!this.props.queue_item) {
					break;
				}

				const from = this.props.queue_item?.uci.slice(0, 2);
				const to   = this.props.queue_item?.uci.slice(2, 4);

				dests.set(from, [to]);
				break;
		}

		return {
			free: false,
			dests: dests
		};
	}

	onDraw(shapes: any) {
		const data: any = [];

		for (const shape of shapes) {
			data.push(shape.orig + ":" + shape.dest + ":" + shape.brush);
		}
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