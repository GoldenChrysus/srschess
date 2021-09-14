import React, { useReducer } from "react";
import { useObserver } from "mobx-react";
import { INPUT_EVENT_TYPE, COLOR, MARKER_TYPE } from "cm-chessboard";

import { ChessControllerModes, ChessControllerProps, ChessControllerState, initial_state } from "../lib/types/ChessControllerTypes";
import MoveList from "../components/chess/MoveList";
import Chessboard from "../components/Chessboard";

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
					onMove={onMove.bind(null, state, dispatch)}
				/>
			</div>
			<MoveList moves={state.moves}/>
		</div>
	);
}

function onMove(state: ChessControllerState, dispatch: Function, event: any) {
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
				type : "move",
				data : {
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

			break;

		default:
			break;
	}

	return Object.assign({}, state, new_state);
}

export default ChessController;