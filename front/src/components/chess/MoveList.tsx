import React from "react";

interface MoveListProps {
	moves: Array<string>,
	onMoveClick: Function
}

class MoveList extends React.Component<MoveListProps> {
	render() {
		return (
			<div className="flex-1 order-3 md:order-3 overflow-y-scroll">
				<div className="max-w-full md:max-w-sm">
					{this.props.moves?.map((move, i, moves) => this.renderListMove(move, i, moves))}
				</div>
			</div>
		);
	}

	renderListMove(item: string, index: number, moves: any) {
		if (index % 2 === 1) {
			return;
		}

		return (
			<div key={"move-list-" + index} className="grid grid-cols-12">
				<div className="col-span-1">{Math.floor(index / 2) + 1}</div>
				<div className="col-span-4">{item}</div>
				<div className="col-span-7">{moves[index + 1]}</div>
			</div>
		);
	}
}

export default MoveList;