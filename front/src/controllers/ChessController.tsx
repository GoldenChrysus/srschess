import React, { useReducer } from "react";
import { useObserver } from "mobx-react";
import { INPUT_EVENT_TYPE, COLOR, MARKER_TYPE } from "cm-chessboard";

import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";
import MoveList from "../components/chess/MoveList";
import Chessboard from "../components/Chessboard";
import Tree from "../components/Tree";
import { generateUUID } from "../helpers";

class ChessController extends React.Component<ChessControllerProps, ChessControllerState> {
	constructor(props: ChessControllerProps) {
		super(props);

		this.state = initial_state;

		this.onMoveClick = this.onMoveClick.bind(this);
	}

	render() {
		return (
			<div className="flex flex-wrap gap-x-8 min-h-full">
				<div className="flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess">
					<Chessboard
						fen={this.state.fen}
						color={this.state.color}
						orientation={this.props.repertoire?.side}
						onMove={this.onMove.bind(this)}
						check_coord={this.state.check_coord}
					/>
				</div>
				<div className="flex-1 order-2 md:order-1">
					<Tree tree={this.props.tree} active_uuid={this.state.last_uuid} new_move={this.state.last_is_new} onMoveClick={this.onMoveClick}/>
				</div>
				<MoveList moves={this.state.moves} onMoveClick={this.onMoveClick}/>
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

				const fen = this.state.chess.fen();
	
				event.chessboard.removeMarkers(undefined, MARKER_TYPE.frame);
				event.chessboard.addMarker(event.squareFrom, MARKER_TYPE.square);
				event.chessboard.disableMoveInput();
	
				const next_color = this.state.chess.turn();

				this.reducer({
					type  : "move",
					data  : {
						color       : (!this.state.chess.game_over()) ? COLOR[(next_color === "w") ? "white" : "black"] : false,
						fen         : fen,
						moves       : this.state.chess.history(),
						check_coord : this.handleCheck(next_color)
					}
				});
	
				break;
	
			default:
				break;
		}
	}

	onMoveClick(uuid: string) {
		this.state.chess.reset();

		const sequence = [uuid];

		while (this.props.moves![uuid].parentId) {
			uuid = this.props.moves![uuid].parentId;

			sequence.push(uuid);
		}

		const reverse_sequence = sequence.reverse();

		for (const tmp_uuid of reverse_sequence) {
			this.state.chess.move(this.props.moves![tmp_uuid].move);
		}

		const next_color = this.state.chess.turn();

		this.reducer({
			type  : "move",
			data  : {
				color       : (!this.state.chess.game_over()) ? COLOR[(next_color === "w") ? "white" : "black"] : false,
				fen         : this.state.chess.fen(),
				moves       : this.state.chess.history(),
				check_coord : this.handleCheck(next_color)
			}
		});
	}

	handleCheck(next_color: string) {
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

			return king_coord;
		}

		return null;
	}

	reducer(action: any) {
		const time = Date.now();
		let new_state: any = {};

		switch (action.type) {
			case "move":
				new_state = action.data;

				const last_move = new_state.moves.at(-1);
				const move_num  = Math.floor(((new_state.moves.length + 1) / 2) * 10);
	
				switch (this.props.mode) {
					case ChessControllerModes.repertoire:
						const uuid = generateUUID(move_num, last_move!, new_state.fen, this.props.repertoire?.id);

						if (!this.props.moves![uuid]) {
							const num_tree = this.props.tree![move_num];
							const new_idx  = (num_tree) ? Object.values(num_tree).at(-1)!.sort + 1 : 0;

							new_state.last_is_new = true;

							this.props.onMove(
								{
									id        : uuid,
									parent_id : this.state.last_uuid,
									move_num  : move_num,
									move      : last_move,
									sort      : new_idx,
									fen       : new_state.fen
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

export default ChessController;