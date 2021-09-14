import React from "react";

interface MoveListProps {
	moves: Array<any[]>
}

class MoveList extends React.Component<MoveListProps> {
	render() {
		return (
			<div className="flex-1 order-3 md:order-3 overflow-y-scroll">
				<div className="max-w-full md:max-w-sm">
					{this.props.moves.map((move, i) => this.renderListMove(move, i))}
				</div>
			</div>
		);
	}

	renderListMove(item: any[], index: number) {
		return (
			<div key={"move-list-" + index} className="grid grid-cols-12">
				<div className="col-span-1">{index + 1}</div>
				<div className="col-span-4">{item[0]}</div>
				<div className="col-span-7">{(item.length === 2) ? item[1] : ""}</div>
			</div>
		);
	}
}

export default MoveList;