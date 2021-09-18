import React from "react";

interface MoveProps {
	index: number,
	white?: string,
	black?: string
}

class Move extends React.PureComponent<MoveProps> {
	render() {
		return (
			<div key={"moveitem-item-" + this.props.index} className="grid grid-cols-12">
				<div key={"movelist-item-num-" + this.props.index} className="col-span-1">{Math.floor(this.props.index / 2) + 1}</div>
				<div key={"movelist-item-white-" + this.props.index} className="col-span-4">{this.props.white}</div>
				<div key={"movelist-item-black-" + this.props.index} className="col-span-7">{this.props.black}</div>
			</div>
		);
	}
}

export default Move;