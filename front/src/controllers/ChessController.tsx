import React from "react";
import Chess, { ChessInstance } from "chess.js";

import { GET_MOVE } from "../api/queries";
import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";
import Chessboard from "../components/Chessboard";
import LeftMenu from "../components/chess/LeftMenu";
import RightMenu from "../components/chess/RightMenu";
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
		if (prev_props.repertoire?.id !== this.props.repertoire?.id || prev_props.mode !== this.props.mode) {
			this.setState(initial_state);
		}
	}

	render() {
		const children = (this.state.last_uuid) ? this.props.arrows[this.state.last_uuid] || [] : [];

		return (
			<div key="chess-outer" className="flex flex-wrap gap-x-8 min-h-full max-h-full overflow-hidden">
				<div key="chessboard-outer" id="chessboard-outer" className="flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess">
					<Chessboard
						key="chessboard"
						fen={this.state.fen}
						pgn={this.state.pgn}
						orientation={this.props.repertoire?.side}
						onMove={this.reducer}
						children={children}
					/>
				</div>
				<LeftMenu
					key="chess-left-menu-component"
					client={this.props.client}
					repertoire={this.props.repertoire}
					moves={this.state.moves}
					active_uuid={this.state.last_uuid}
					new_move={this.state.last_is_new}
					mode={this.props.mode}
					onMoveClick={this.onMoveClick.bind(this, "tree")}
				/>
				<RightMenu
					key="chess-right-menu-component"
					client={this.props.client}
					active_num={this.state.last_num}
					moves={this.state.history}
					fen={this.state.fen}
					mode={this.props.mode}
					repertoire_id={this.props.repertoire?.id}
					repertoire_name={this.props.repertoire?.name}
					onMoveClick={this.onMoveClick.bind(this, "history")}
				/>
			</div>
		);
	}

	generateHistory(uuid?: string | null) {
		const data: { [ key: string] : any } = {
			moves   : [],
			history : [],
		};

		if (!uuid) {
			return data;
		}

		do {
			const move = this.getMove(uuid);

			data.history.push({
				id   : uuid,
				move : move.move
			});

			data.moves.push(move.move);

			uuid = move.parentId;
		} while (uuid);

		data.moves   = data.moves.reverse();
		data.history = data.history.reverse();

		return data;
	}

	onMoveClick(source: string, uuid: string) {
		this.chess.reset();

		const data = this.generateHistory(uuid);

		for (const move of data.moves) {
			this.chess.move(move);
		}

		this.reducer({
			type  : "click-" + source,
			data  : {
				pgn       : this.chess.pgn(),
				last_uuid : uuid,
				fen       : this.chess.fen(),
				moves     : data.moves,
				history   : (source === "tree") ? data.history : this.state.history,
			}
		});
	}

	reducer(action: any) {
		let new_state = action.data;

		const move_num  = Math.floor(((new_state.moves.length + 1) / 2) * 10);

		new_state.last_num  = move_num;

		switch (action.type) {
			case "click-history":
			case "click-tree":
				this.setState(new_state);
				break;

			case "move":
				const last_move = new_state.moves.at(-1);
				const prev_uuid = this.state.last_uuid;
	
				switch (this.props.mode) {
					case ChessControllerModes.repertoire:
						const uuid = generateUUID(move_num, last_move!, new_state.fen, this.props.repertoire?.id);

						new_state.last_uuid = uuid;

						if (!this.historyContainsUUID(uuid)) {
							new_state.history = this.generateHistory(prev_uuid).history;

							new_state.history.push({
								id   : uuid,
								move : last_move
							});
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
									uci       : action.uci,
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

	historyContainsUUID(uuid: string) {
		return (this.state.history.filter(x => x.id === uuid).length > 0);
	}

	getMove(id: string) {
		return this.props.client.readFragment({
			id       : "Move:" + id,
			fragment : GET_MOVE
		});
	}
}

export default ChessController;