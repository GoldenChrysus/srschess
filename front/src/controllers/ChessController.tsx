import React, { useReducer } from "react";
import { useObserver } from "mobx-react";
import { INPUT_EVENT_TYPE, COLOR, MARKER_TYPE } from "cm-chessboard";
import Chess, { ChessInstance } from "chess.js";

import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";
import MoveList from "../components/chess/MoveList";
import Chessboard from "../components/Chessboard";
import Tree from "../components/Tree";
import { generateUUID } from "../helpers";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

class ChessController extends React.Component<ChessControllerProps, ChessControllerState> {
	private chess = Chess2();

	constructor(props: ChessControllerProps) {
		super(props);

		this.state = initial_state;

		this.onMoveClick = this.onMoveClick.bind(this);
	}

	render() {
		return (
			<div key="chess-outer" className="flex flex-wrap gap-x-8 min-h-full">
				<div key="chessboard-outer" className="flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess">
					<Chessboard
						key="chessboard"
						fen={this.state.fen}
						orientation={this.props.repertoire?.side}
						onMove={this.reducer.bind(this)}
					/>
				</div>
				<div key="tree-outer" className="flex-1 order-2 md:order-1">
					<Tree key="tree" tree={this.props.tree} active_uuid={this.state.last_uuid} new_move={this.state.last_is_new} onMoveClick={this.onMoveClick}/>
				</div>
				<MoveList key="movelist" moves={this.state.moves} onMoveClick={this.onMoveClick}/>
			</div>
		);
	}

	onMoveClick(uuid: string) {
		this.chess.reset();

		const sequence = [uuid];

		while (this.props.moves![uuid].parentId) {
			uuid = this.props.moves![uuid].parentId;

			sequence.push(uuid);
		}

		const reverse_sequence = sequence.reverse();

		for (const tmp_uuid of reverse_sequence) {
			this.chess.move(this.props.moves![tmp_uuid].move);
		}

		this.reducer({
			type  : "move",
			data  : {
				fen   : this.chess.fen(),
				moves : this.chess.history()
			}
		});
	}

	reducer(action: any) {
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