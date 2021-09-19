import React from "react";
import Chess, { ChessInstance } from "chess.js";

import { GET_MOVE } from "../api/queries";
import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";
import MoveList from "../components/chess/MoveList";
import Chessboard from "../components/Chessboard";
import LeftMenu from "../components/chess/LeftMenu";
import { generateUUID } from "../helpers";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

class ChessController extends React.Component<ChessControllerProps, ChessControllerState> {
	private chess = Chess2();

	constructor(props: ChessControllerProps) {
		super(props);

		this.state = initial_state;

		this.reducer     = this.reducer.bind(this);
		this.onMoveClick = this.onMoveClick.bind(this);
	}

	componentDidUpdate(prev_props: ChessControllerProps) {
		if (prev_props.repertoire?.id !== this.props.repertoire?.id) {
			this.setState(initial_state);
		}
	}

	render() {
		return (
			<div key="chess-outer" className="flex flex-wrap gap-x-8 min-h-full max-h-full overflow-hidden">
				<div key="chessboard-outer" className="flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess">
					<Chessboard
						key="chessboard"
						fen={this.state.fen}
						pgn={this.state.pgn}
						orientation={this.props.repertoire?.side}
						onMove={this.reducer}
					/>
				</div>
				<LeftMenu client={this.props.client} repertoire={this.props.repertoire} moves={this.state.moves} active_uuid={this.state.last_uuid} new_move={this.state.last_is_new} onMoveClick={this.onMoveClick}/>
				<MoveList key="movelist" moves={this.state.moves} onMoveClick={this.onMoveClick}/>
			</div>
		);
	}

	onMoveClick(uuid: string) {
		this.chess.reset();

		const sequence = [];

		do {
			const move = this.getMove(uuid);

			sequence.push(move.move);

			uuid = move.parentId;
		} while (uuid);

		const reverse_sequence = sequence.reverse();

		for (const move of reverse_sequence) {
			this.chess.move(move);
		}

		this.reducer({
			type  : "click",
			data  : {
				fen   : this.chess.fen(),
				moves : this.chess.history()
			}
		});
	}

	reducer(action: any) {
		let new_state = action.data;

		switch (action.type) {
			case "click":
			case "move":
				const last_move = new_state.moves.at(-1);
				const move_num  = Math.floor(((new_state.moves.length + 1) / 2) * 10);
				const prev_uuid = this.state.last_uuid;
	
				switch (this.props.mode) {
					case ChessControllerModes.repertoire:
						const uuid = generateUUID(move_num, last_move!, new_state.fen, this.props.repertoire?.id);

						new_state.last_uuid = uuid;

						if (action.type === "click") {
							new_state.pgn = this.chess.pgn();
						}

						if (!this.getMove(uuid)) {
							new_state.last_is_new = true;

							this.setState(new_state);
							this.props.onMove(
								{
									id        : uuid,
									parent_id : prev_uuid,
									move_num  : move_num,
									move      : last_move,
									fen       : new_state.fen
								}
							);
						} else {
							this.setState(new_state);
						}

						break;

					default:
						break;
				}
	
				break;
	
			default:
				break;
		}
	}

	getMove(id: string) {
		return this.props.client.readFragment({
			id       : "Move:" + id,
			fragment : GET_MOVE
		});
	}
}

export default ChessController;