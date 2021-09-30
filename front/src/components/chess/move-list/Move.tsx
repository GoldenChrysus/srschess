import { move } from "chessground/draw";
import React, { EventHandler, MouseEventHandler } from "react";
import { ChessControllerHistoryItem } from "../../../lib/types/ChessControllerTypes";

interface MoveProps {
	index: number,
	white?: ChessControllerHistoryItem,
	black?: ChessControllerHistoryItem,
	active_color: string | null,
	onClick: Function
}

class Move extends React.PureComponent<MoveProps> {
	render() {
		return (
			<div key={"moveitem-item-" + this.props.index} className="grid grid-cols-12">
				<div key={"movelist-item-num-" + this.props.index} className="text-center col-span-2 move-number py-1">
					{Math.floor(this.props.index / 2) + 1}
				</div>
				{this.getMoves()}
			</div>
		);
	}

	getMoves() {
		const moves = [];

		for (const color of ["white", "black"]) {
			if (color === "black" && !this.props.black) {
				continue;
			}

			const active_class = (this.props.active_color === color) ? "bg-gray-700" : "";
			const move         = (color === "white") ? this.props.white : this.props.black;

			moves.push(
				<div key={"movelist-item-" + color + "-" + this.props.index} className={"col-span-5 p-1 py-1 px-3.5 hover:bg-green-700 cursor-pointer " + active_class} onClick={() => this.props.onClick(move!.id)}>
					{move!.move}
				</div>
			);
		}

		return moves;
	}
}

export default Move;