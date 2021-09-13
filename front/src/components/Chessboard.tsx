import React from "react";
import Chessground from "react-chessground";
import Chess, { ChessInstance, Square } from "chess.js";

import MoveList from "./chess/MoveList";

import "react-chessground/dist/styles/chessground.css";
import "../styles/chessboard.css";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

interface ChessboardState {
	chess      : ChessInstance,
	tree       : any,
	tree_moves : any,
	moves      : Array<any[]>
}

class Chessboard extends React.Component<object, ChessboardState> {
	private ground_ref = React.createRef<any>();

	constructor(props: {}) {
		super(props);

		this.state = {
			chess      : Chess2(),
			tree       : {},
			tree_moves : {},
			moves      : []
		}

		this.onMove         = this.onMove.bind(this);
		this.onPromo        = this.onPromo.bind(this);
		this.toColor        = this.toColor.bind(this);
		this.toDests        = this.toDests.bind(this);
		this.checkColor     = this.checkColor.bind(this);
		this.sizeBoard      = this.sizeBoard.bind(this);
		this.lastMove       = this.lastMove.bind(this);
	}

	componentDidMount() {
		this.sizeBoard();
		window.addEventListener("resize", this.sizeBoard);
	}

	render() {
		let shape = {
			brush : "green",
			dest : "f4",
			orig : "e2"
		};

		const config = {
			fen     : this.state.chess.fen(),
			movable : {
				color : this.toColor(),
				free  : false,
				dests : this.toDests()
			},
			draggable : {
				showGhost : true
			},
			drawable : {
				enabled: true,
				eraseOnClick : false,
				onChange     : (shape: object) => {
					console.log(shape)
				},
				autoShapes : [
					shape
				]
			},
			events : {
				insert : this.sizeBoard
			}
		};

		return (
			<div className="flex flex-wrap gap-x-8">
				<div className="flex-1 order-2 md:order-1">z</div>
				<div className="flow-grow-0 order-1 md:order-2">
					<Chessground
						fen={this.state.chess.fen()}
						check={this.checkColor()}
						movable={config.movable}
						draggable={config.draggable}
						drawable={config.drawable}
						onMove={this.onMove}
						promotion={this.onPromo}
						lastMove={this.lastMove()}
						turnColor={this.toColor()}
						events={config.events}
						ref={this.ground_ref}
					/>
				</div>
				<MoveList moves={this.state.moves}/>
			</div>
		);
	}

	lastMove() {
		const history = this.state.chess.history({ verbose: true });

		return (history.length)
			? [history.at(-1)?.from, history.at(-1)?.to]
			: null;
	}

	sizeBoard() {
		if (!this.ground_ref.current) {
			return;
		}

		const board = this.ground_ref.current.el;
		const width = Math.min(document.getElementById("content")!.offsetHeight, window.screen.width);

		board.style.width = board.style.height = `${width}px`;
	}

	onMove(orig: Square, dest: Square) {
		this.state.chess.move({
			from : orig,
			to   : dest
		});

		const history     = this.state.chess.history();
		const movelist    = history.join(".");
		const move_number = (history.length + 1) / 2.0;
		const move_index  = +Math.floor((history.length - 1) / 2).toFixed(0);

		let tree = {
			...this.state.tree
		};
		let tree_moves = {
			...this.state.tree_moves
		};
		let moves = this.state.moves;

		if (!tree[movelist]) {
			tree[movelist] = {
				movelist : movelist,
				move     : move_number,
				sort     : (Array.isArray(tree_moves[move_number])) ? tree_moves[move_number].length : 0,
				children : 0
			};
		}

		if (!tree_moves[move_number]) {
			tree_moves[move_number] = [];
		}

		if (!tree_moves[move_number].includes(movelist)) {
			tree_moves[move_number].push(movelist);
		}

		if (!moves[move_index]) {
			moves.push([]);
		}

		moves[move_index].push(history.at(-1));

		this.setState({
			chess : this.state.chess,

			tree,
			tree_moves,
			moves
		});
	}

	onPromo(e:any) {
		console.log(e);
	}

	toColor() {
		return (this.state.chess.turn() === "w") ? "white" : "black";
	}

	checkColor() {
		return (this.state.chess.in_check())
			? this.toColor()
			: "";
	}

	toDests() {
		const dests = new Map();

		this.state.chess.SQUARES.forEach(s => {
			const ms = this.state.chess.moves({
				square  : s,
				verbose : true
			});

			if (ms.length) {
				dests.set(s, ms.map(m => m.to));
			}
		});

		return dests;
	}
}

export default Chessboard;