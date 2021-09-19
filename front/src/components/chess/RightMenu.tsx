import React from "react";
import { Collapse } from "antd";
import { ChessControllerState } from "../../lib/types/ChessControllerTypes";

import MoveList from "./MoveList";

interface RightMenuProps {
	client: any,
	active_num?: ChessControllerState["last_num"],
	fen: string,
	moves: Array<string>,
	onMoveClick: Function
}

class RightMenu extends React.PureComponent<RightMenuProps> {
	render() {
		return (
			<div key="chess-right-menu-inner" id="chess-right-menu" className="flex-1 order-3 md:order-3" style={{ maxHeight: "calc(100vh - 2.75rem)" }}>
				<MoveList client={this.props.client} active_num={this.props.active_num} fen={this.props.fen} moves={this.props.moves} onMoveClick={this.props.onMoveClick}/>
				<Collapse accordion bordered={false} defaultActiveKey="test-panel">
					<Collapse.Panel id="test-panel" header="Test Section" key="test-panel">
						Test
					</Collapse.Panel>
				</Collapse>
			</div>
		);
	}
}

export default RightMenu;