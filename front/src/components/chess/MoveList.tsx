import React from "react";
import { ChessControllerHistoryItem, ChessControllerState } from "../../lib/types/ChessControllerTypes";

import { GET_MOVE } from "../../api/queries";

import Move from "./move-list/Move";
import Stockfish from "./move-list/Stockfish";
import { ApolloClient } from "@apollo/client";

interface MoveListProps {
	client: ApolloClient<object>,
	active_num?: ChessControllerState["last_num"],
	fen: string,
	moves: ChessControllerState["history"],
	onMoveClick: Function
}

class MoveList extends React.Component<MoveListProps> {
	shouldComponentUpdate(next_props: MoveListProps) {
		return (
			next_props.fen !== this.props.fen ||
			next_props.active_num !== this.props.active_num ||
			JSON.stringify(next_props.moves) !== JSON.stringify(this.props.moves)
		);
	}

	render() {
		return (
			<>
				<Stockfish fen={this.props.fen} num={this.props.active_num} key="stockfish-component"/>
				<div key="movelist" id="movelist" className="max-w-full md:max-w-sm">
					{this.props.moves?.map((move, i, moves) => this.renderListMove(move, i, moves))}
				</div>
			</>
		);
	}

	renderListMove(item: ChessControllerHistoryItem, index: number, moves: MoveListProps["moves"]) {
		if (index % 2 === 1) {
			return;
		}

		const move_num   = Math.floor(((index + 2) / 2) * 10);
		let active_color = null;

		if (this.props.active_num === move_num) {
			active_color = "white";
		} else if (this.props.active_num === (move_num + 5)) {
			active_color = "black";
		}

		return <Move key={"movelist-move-" + index} index={index} white={item} black={moves[index + 1]} active_color={active_color} onClick={this.props.onMoveClick}/>;
	}

	getMove(id?: ChessControllerState["last_uuid"]) {
		if (!id) {
			return false;
		}

		return this.props.client.readFragment({
			id       : "Move:" + id,
			fragment : GET_MOVE
		});
	}
}

export default MoveList;