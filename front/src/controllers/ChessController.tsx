import React, { useReducer } from "react";
import { useObserver } from "mobx-react";
import * as crypto from "crypto";
import { INPUT_EVENT_TYPE, COLOR, MARKER_TYPE } from "cm-chessboard";

import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";
import MoveList from "../components/chess/MoveList";
import Chessboard from "../components/Chessboard";

class ChessController extends React.Component<ChessControllerProps, ChessControllerState> {
	constructor(props: ChessControllerProps) {
		super(props);

		this.state = initial_state;
	}

	render() {
		return (
			<div className="flex flex-wrap gap-x-8 min-h-full">
				<div className="flex-1 order-2 md:order-1">
					{this.props.repertoire?.id}
				</div>
				<div className="flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess">
					<Chessboard
						fen={this.state.fen}
						color={this.state.color}
						orientation={this.props.repertoire?.side}
						onMove={this.onMove.bind(this)}
					/>
				</div>
				<MoveList moves={this.state.moves}/>
			</div>
		);
	}

	onMove(event: any) {
		event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot);
		event.chessboard.removeMarkers(undefined, MARKER_TYPE.square);
	
		switch (event.type) {
			case INPUT_EVENT_TYPE.moveStart:
				const moves = this.state.chess.moves({square: event.square, verbose: true});
	
				event.chessboard.addMarker(event.square, MARKER_TYPE.square);
	
				for (const move of moves) {
					event.chessboard.addMarker(move.to, MARKER_TYPE.dot);
				}
	
				return (moves.length > 0);
	
			case INPUT_EVENT_TYPE.moveDone:
				const move = {from: event.squareFrom, to: event.squareTo};
				const res  = this.state.chess.move(move);
	
				if (!res) {
					return res;
				}
	
				event.chessboard.removeMarkers(undefined, MARKER_TYPE.square);
				event.chessboard.removeMarkers(undefined, MARKER_TYPE.frame);
				event.chessboard.addMarker(event.squareFrom, MARKER_TYPE.square);
				event.chessboard.disableMoveInput();
				event.chessboard.setPosition(this.state.chess.fen());
	
				const next_color = this.state.chess.turn();
	
				if (this.state.chess.in_check()) {
					const board = this.state.chess.board();
	
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
	
					event.chessboard.addMarker(king_coord, MARKER_TYPE.frame);
				}
	
				this.reducer({
					type  : "move",
					data  : {
						color : (!this.state.chess.game_over()) ? COLOR[(next_color === "w") ? "white" : "black"] : false,
						fen   : this.state.chess.fen(),
						moves : this.state.chess.history()
					}
				});
	
				break;
	
			default:
				break;
		}
	}

	reducer(action: any) {
		const new_state: ChessControllerState = Object.assign({}, this.state);

		switch (action.type) {
			case "move":
				new_state.color = action.data.color;
				new_state.fen   = action.data.fen;
				new_state.moves = action.data.moves;

				const last_move = new_state.moves.at(-1);
				const move_num  = Math.floor(((new_state.moves.length + 1) / 2) * 10);
	
				switch (this.props.mode) {
					case ChessControllerModes.repertoire:
						const num_tree  = this.props.tree![move_num];
						const new_idx   = (num_tree) ? Object.values(num_tree).at(-1)!.sort + 1 : 0;
						const hash      = crypto.createHash("md5").update(`${this.props.repertoire?.id}:${move_num}:${last_move}`).digest("hex");
						const uuid      = [
							hash.substr(0, 8),
							hash.substr(8, 4),
							hash.substr(12, 4),
							hash.substr(16, 4),
							hash.substr(20, 12)
						].join("-");

						if (!this.props.moves![uuid]) {
							this.props.onMove(
								{
									id        : uuid,
									parent_id : this.state.last_uuid,
									move_num  : move_num,
									move      : last_move,
									sort      : new_idx,
									fen       : this.state.chess.fen()
								}
							);
						}

						new_state.last_uuid = uuid;

						break;

					default:
						break;
				}
	
				break;
	
			default:
				break;
		}
	
		this.setState(new_state);
	}
}

/* 
function ChessController(props: ChessControllerProps) {
	const [state, dispatch] = useReducer(reducer, initial_state);

	let data = "";

	switch (props.mode) {
		case ChessControllerModes.repertoire:
			data = "repertoire";

			break;
		
		default:
			data = "none";

			break;
	}

	return (
		<div className="flex flex-wrap gap-x-8 min-h-full">
			<div className="flex-1 order-2 md:order-1">
				{props.repertoire?.id}
			</div>
			<div className="flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess">
				<Chessboard
					fen={state.fen}
					color={state.color}
					orientation={props.repertoire?.side}
					onMove={onMove.bind(null, props, state, dispatch)}
				/>
			</div>
			<MoveList moves={state.moves}/>
		</div>
	);
}

function onMove(props: ChessControllerProps, state: ChessControllerState, dispatch: Function, event: any) {
	event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot);
	event.chessboard.removeMarkers(undefined, MARKER_TYPE.square);

	switch (event.type) {
		case INPUT_EVENT_TYPE.moveStart:
			const moves = state.chess.moves({square: event.square, verbose: true});

			event.chessboard.addMarker(event.square, MARKER_TYPE.square);

			for (const move of moves) {
				event.chessboard.addMarker(move.to, MARKER_TYPE.dot);
			}

			return (moves.length > 0);

		case INPUT_EVENT_TYPE.moveDone:
			const move = {from: event.squareFrom, to: event.squareTo};
			const res  = state.chess.move(move);

			if (!res) {
				return res;
			}

			event.chessboard.removeMarkers(undefined, MARKER_TYPE.square);
			event.chessboard.removeMarkers(undefined, MARKER_TYPE.frame);
			event.chessboard.addMarker(event.squareFrom, MARKER_TYPE.square);
			event.chessboard.disableMoveInput();
			event.chessboard.setPosition(state.chess.fen());

			const next_color = state.chess.turn();

			if (state.chess.in_check()) {
				const board = state.chess.board();

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

				event.chessboard.addMarker(king_coord, MARKER_TYPE.frame);
			}

			dispatch({
				type  : "move",
				props : props,
				data  : {
					color : (!state.chess.game_over()) ? COLOR[(next_color === "w") ? "white" : "black"] : false,
					fen   : state.chess.fen(),
					moves : state.chess.history()
				}
			});

			break;

		default:
			break;
	}
}

function reducer(state: ChessControllerState, action: any) {
	const new_state: ChessControllerState = Object.assign({}, state);

	switch (action.type) {
		case "move":
			new_state.color = action.data.color;
			new_state.fen   = action.data.fen;
			new_state.moves = action.data.moves;

			const last_move = new_state.moves.at(-1);
			const move_num  = Math.floor(((new_state.moves.length + 1) / 2) * 10);
			const new_idx   = (action.props[move_num]) ? action.props[move_num].length : 0;
			console.log(action.props);
			console.log(`${action.props.repertoire?.id}:${move_num}:${last_move}`);
			const hash      = crypto.createHash("md5").update(`${action.props.repertoire?.id}:${move_num}:${last_move}`).digest("hex");
			const uuid      = [
				hash.substr(0, 8),
				hash.substr(8, 4),
				hash.substr(12, 4),
				hash.substr(16, 4),
				hash.substr(20, 12)
			].join("-");

			console.log(uuid);

			break;

		default:
			break;
	}

	return Object.assign({}, state, new_state);
} */

export default ChessController;