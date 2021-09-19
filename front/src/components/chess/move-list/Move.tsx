import React from "react";

interface MoveProps {
	index: number,
	white?: string,
	black?: string
}

class Move extends React.PureComponent<MoveProps> {
	render() {
		return (
			<div key={"moveitem-item-" + this.props.index} className="grid grid-cols-12 gap-x-3.5">
				<div key={"movelist-item-num-" + this.props.index} className="text-center col-span-2 move-number py-1">
					{Math.floor(this.props.index / 2) + 1}
				</div>
				<div key={"movelist-item-white-" + this.props.index} className="col-span-5 py-1">{this.props.white}</div>
				<div key={"movelist-item-black-" + this.props.index} className="col-span-5 py-1">{this.props.black}</div>
			</div>
		);
	}
}

export default Move;