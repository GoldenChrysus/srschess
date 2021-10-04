import React from "react";
import Chess, { ChessInstance } from "chess.js";

import { GET_MOVE } from "../api/queries";
import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";
import { RepertoireLessonItemModel } from "../lib/types/models/Repertoire";
import Chessboard from "../components/Chessboard";
import LeftMenu from "../components/chess/LeftMenu";
import RightMenu from "../components/chess/RightMenu";
import { generateUUID } from "../helpers";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

class ChessController extends React.Component<ChessControllerProps, ChessControllerState> {
	private chess                                   = Chess2();
	private chunk_limit                             = 5;
	private chunk: Array<RepertoireLessonItemModel> = [];
	private preloaded_moves: Array<string>          = [];

	constructor(props: ChessControllerProps) {
		super(props);

		this.state = initial_state;

		this.reducer     = this.reducer.bind(this);
		this.onMoveClick = this.onMoveClick.bind(this);
	}

	componentDidUpdate(prev_props: ChessControllerProps) {
		if (prev_props.repertoire?.id !== this.props.repertoire?.id || prev_props.mode !== this.props.mode) {
			this.chess.reset();
			this.setState(initial_state);

			this.chunk_limit = 5;

			this.progressQueue();
		}
	}

	render() {
		const children   = (this.state.last_uuid) ? this.props.arrows[this.state.last_uuid] || [] : this.props.arrows["root"] || [];
		const queue_item = (this.props.mode === "lesson") ? this.props.repertoire?.lessonQueue![this.state.queue_index] : null;

		return (
			<div key="chess-outer" className="flex flex-wrap gap-x-8 min-h-full max-h-full overflow-hidden">
				<div key="chessboard-outer" id="chessboard-outer" className="flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess">
					<Chessboard
						mode={this.props.mode}
						key="chessboard"
						fen={this.state.fen}
						pgn={this.state.pgn}
						orientation={this.props.repertoire?.side}
						repertoire_id={this.props.repertoire?.id}
						onMove={this.reducer}
						children={children}
						queue_item={(this.state.preloading) ? null : queue_item}
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
					lesson_count={this.props.repertoire?.lessonQueueLength ?? this.props.repertoire?.lessonQueue?.length}
					review_count={0}
					onMoveClick={this.onMoveClick.bind(this, "history")}
				/>
			</div>
		);
	}

	progressQueue() {
		if (this.props.mode !== "lesson") {
			return;
		}

		const move = (this.chunk.length) ? this.chunk[0] : this.props.repertoire?.lessonQueue![this.state.queue_index];

		if (!move) {
			return;
		}

		let pre_moves      = JSON.parse(move.movelist).slice(0, -1);
		let pre_move_index = -1;

		if (pre_moves.slice(0, -1).join(":") === this.preloaded_moves.join(":")) {
			pre_moves = pre_moves.slice(-1);
		} else {
			this.preloaded_moves = [];

			this.chess.reset();
		}

		if (pre_moves.length) {
			const pre_move_interval = setInterval(
				() => {
					pre_move_index++;

					if (pre_move_index >= pre_moves.length) {
						clearInterval(pre_move_interval);
						return;
					}

					const move = pre_moves[pre_move_index];

					this.preloaded_moves.push(move);
					this.chess.move(move);

					const history = this.chess.history();

					this.reducer({
						type  : "queue-premove",
						data  : {
							preloading : (pre_move_index !== (pre_moves.length - 1)),
							pgn        : this.chess.pgn(),
							fen        : this.chess.fen(),
							moves      : history,
							history    : history
						}
					});
				},
				500
			);
		} else {
			this.setState({
				preloading : false
			});
		}
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
		if (this.props.mode !== "repertoire") {
			return false;
		}

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

	buildQueueHistory(new_state: any) {
		const real_history = [];
		let history_id = 0;

		for (const move of new_state.moves) {
			real_history.push({
				id   : --history_id,
				move : move
			});
		}

		return real_history;
	}

	reducer(action: any) {
		let new_state = action.data;

		const move_num  = Math.floor(((new_state.moves.length + 1) / 2) * 10);
		const last_move = new_state.moves.at(-1);

		new_state.last_num = move_num;

		switch (action.type) {
			case "click-history":
			case "click-tree":
				this.setState(new_state);
				break;

			case "queue-premove":
				new_state.history = this.buildQueueHistory(new_state);

				this.setState(new_state);
				break;

			case "move-lesson":
				let queue = this.props.repertoire?.lessonQueue!;

				this.chunk.push(queue[this.state.queue_index]);

				if (this.chunk.length === this.chunk_limit || this.state.queue_index === (queue.length - 1)) {
					this.chess.reset();

					this.preloaded_moves = [];

					this.setState({
						fen        : initial_state.fen,
						pgn        : initial_state.pgn,
						history    : initial_state.history,
						moves      : initial_state.moves,
						last_num   : initial_state.last_num,
						preloading : true
					});
				} else {
					this.chess.move(last_move);
					this.preloaded_moves.push(new_state.moves.at(-1));
					this.setState({
						queue_index : this.state.queue_index + 1,
						fen         : new_state.fen,
						pgn         : new_state.pgn,
						history     : this.buildQueueHistory(new_state),
						moves       : new_state.moves,
						last_num    : move_num,
						preloading  : true
					});
				}

				this.progressQueue();
				break;

			case "move-quiz":
				break;

			case "move-repertoire":
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

						const cached_move = this.getMove(uuid);

						if (!cached_move) {
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
						} else if (prev_uuid && cached_move.parentId !== prev_uuid) {
							const prev_move = this.getMove(prev_uuid);

							if (prev_move && prev_move.transpositionId !== uuid) {
								this.props.onTransposition(uuid, prev_uuid);
							}

							this.setState(new_state);
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