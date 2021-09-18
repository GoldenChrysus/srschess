import React from "react";

import Move from "./move-list/Move";

interface MoveListProps {
	moves: Array<string>,
	onMoveClick: Function
}

class MoveList extends React.PureComponent<MoveListProps> {
	render() {
		return (
			<div key="movelist" className="flex-1 order-3 md:order-3 overflow-y-scroll">
				<div key="movelist-inner" className="max-w-full md:max-w-sm">
					{this.props.moves?.map((move, i, moves) => this.renderListMove(move, i, moves))}
				</div>
			</div>
		);
	}

	renderListMove(item: string, index: number, moves: any) {
		if (index % 2 === 1) {
			return;
		}

		return <Move key={"movelist-move-" + index} index={index} white={item} black={moves[index + 1]}/>;
	}
}

export default MoveList;