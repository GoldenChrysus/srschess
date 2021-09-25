import React from "react";
import { ChessControllerState } from "../../lib/types/ChessControllerTypes";

import { GET_MOVE } from "../../api/queries";

import Move from "./move-list/Move";
import Stockfish from "./move-list/Stockfish";

interface MoveListProps {
	client: any,
	active_num?: ChessControllerState["last_num"],
	fen: string,
	moves: Array<string>,
	onMoveClick: Function
}

class MoveList extends React.PureComponent<MoveListProps> {
	render() {
		return (
			<>
				<Stockfish fen={this.props.fen} num={this.props.active_num} key="stockfish-component"/>
				<div key="movelist" id="movelist" className="max-w-full md:max-w-sm bottom-border">
					{this.props.moves?.map((move, i, moves) => this.renderListMove(move, i, moves))}
				</div>
			</>
		);
	}

	renderListMove(item: string, index: number, moves: any) {
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