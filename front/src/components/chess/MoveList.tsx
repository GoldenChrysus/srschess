import React from "react";
import { Switch, Collapse } from "antd";
import { ChessControllerState } from "../../lib/types/ChessControllerTypes";

import { GET_MOVE } from "../../api/queries";

import Move from "./move-list/Move";

interface MoveListProps {
	client: any,
	active_uuid?: ChessControllerState["last_uuid"],
	moves: Array<string>,
	onMoveClick: Function
}

class MoveList extends React.PureComponent<MoveListProps> {
	render() {
		const active_move = this.getMove(this.props.active_uuid);

		return (
			<div key="chess-right-menu" id="chess-right-menu" className="flex-1 order-3 md:order-3 overflow-y-auto">
				<div key="stockfish" id="stockfish" className="max-w-full">
					<div className="max-w-full 2xl:max-w-sm">
						<div key="stockfish-grid" className="grid grid-cols-12 p-2">
							<div key="stockfish-eval" className="flex justify-center items-center text-center text-2xl font-bold col-span-3">
								<span>-</span>
							</div>
							<div key="stockfish-feedback" className="text-left text-xs text-gray-400 col-span-6">
								<p>Stockfish 14+ <span className="text-green-500 font-medium">NNUE</span></p>
								<p>Waiting...</p>
							</div>
							<div key="stockfish-switch-container" className="flex justify-end items-center col-span-3">
								<Switch/>
							</div>
						</div>
					</div>
				</div>
				<div key="movelist" id="movelist" className="max-w-full md:max-w-sm">
					{this.props.moves?.map((move, i, moves) => this.renderListMove(move, i, moves, active_move))}
				</div>
				<Collapse accordion bordered={false} defaultActiveKey="test-panel">
					<Collapse.Panel id="test-panel" header="Test Section" key="test-panel">
						Test
					</Collapse.Panel>
				</Collapse>
			</div>
		);
	}

	renderListMove(item: string, index: number, moves: any, active_move: any) {
		if (index % 2 === 1) {
			return;
		}

		const move_num   = Math.floor(((index + 2) / 2) * 10);
		let active_color = null;

		if (active_move) {
			if (active_move.moveNumber === move_num) {
				active_color = "white";
			} else if (active_move.moveNumber === (move_num + 5)) {
				active_color = "black";
			}
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