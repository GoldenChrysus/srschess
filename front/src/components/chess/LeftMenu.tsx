import React from "react";
import { Collapse } from "antd";

import { ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";
import Tree from "../Tree";
import Repertoires from "./left-menu/Repertoires";

import "../../styles/chess/repertoires.css";

interface LeftMenuProps {
	client: ChessControllerProps["client"],
	repertoire?: ChessControllerProps["repertoire"],
	moves: ChessControllerState["moves"],
	active_uuid: ChessControllerState["last_uuid"],
	new_move: ChessControllerState["last_is_new"],
	mode: ChessControllerProps["mode"],
	onMoveClick: Function
}

class LeftMenu extends React.Component<LeftMenuProps> {
	render() {
		return (
			<div key="chess-left-menu-inner" id="chess-left-menu" className="flex-1 order-2 md:order-1" style={{ maxHeight: "calc(100vh - 2.75rem)" }}>
				<Collapse accordion bordered={false} defaultActiveKey={(this.props.repertoire) ? "tree-panel" : "repertoires-panel"}>
					{this.renderTree()}
					<Collapse.Panel id="repertoires-panel" header="Repertoires" key="repertoires-panel">
						<Repertoires active_id={this.props.repertoire?.id} mode={this.props.mode}/>
					</Collapse.Panel>
				</Collapse>
			</div>
		);
	}

	renderTree() {
		if (this.props.mode !== "repertoire") {
			return null;
		}

		return (
			<Collapse.Panel id="tree-panel" header="Move Tree" key="tree-panel" forceRender={true}>
				<Tree key="tree" client={this.props.client} repertoire={this.props.repertoire} moves={this.props.moves} active_uuid={this.props.active_uuid} new_move={this.props.new_move} onMoveClick={this.props.onMoveClick}></Tree>
			</Collapse.Panel>
		);
	}
}

export default LeftMenu;