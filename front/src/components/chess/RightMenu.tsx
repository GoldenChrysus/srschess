import React from "react";
import { Translation } from "react-i18next";
import { Collapse, Input } from "antd";
import { ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";

import MoveList from "./MoveList";
import Repertoire from "./right-menu/Repertoire";

import "../../styles/components/chess/right-menu.css";
import RepertoireMoveNote from "./right-menu/RepertoireMoveNote";

interface RightMenuProps {
	active_num?: ChessControllerState["last_num"],
	active_uuid?: ChessControllerState["last_uuid"],
	fen: string,
	moves: ChessControllerState["history"],
	mode: ChessControllerProps["mode"],
	repertoire_slug?: string,
	repertoire_name?: string,
	onMoveClick: Function
}

class RightMenu extends React.Component<RightMenuProps> {
	shouldComponentUpdate(prev_props: RightMenuProps) {
		return (
			prev_props.active_num !== this.props.active_num ||
			prev_props.fen !== this.props.fen ||
			prev_props.moves !== this.props.moves ||
			prev_props.mode !== this.props.mode ||
			prev_props.repertoire_slug !== this.props.repertoire_slug ||
			prev_props.repertoire_name !== this.props.repertoire_name
		);
	}

	render() {
		return (
			<div key="chess-right-menu-inner" id="chess-right-menu" className="flex-1 order-2 mb-6 md:order-3 md:mb-0">
				{this.renderRepertoire()}
				<MoveList mode={this.props.mode} active_num={this.props.active_num} fen={this.props.fen} moves={this.props.moves} onMoveClick={this.props.onMoveClick}/>
				<Translation ns="chess">
					{
						(t) => (
							<Collapse accordion bordered={false} defaultActiveKey="position-panel" className="top-border">
								<Collapse.Panel id="position-panel" header={t("position_data")} key="position-panel">
									<Input addonBefore="FEN" value={this.props.fen}/>
									{!["review", "lesson"].includes(this.props.mode) && <RepertoireMoveNote active_uuid={this.props.active_uuid}/>}
								</Collapse.Panel>
							</Collapse>
						)
					}
				</Translation>
			</div>
		);
	}

	renderRepertoire() {
		if (this.props.repertoire_slug) {
			return (
				<Repertoire mode={this.props.mode} slug={this.props.repertoire_slug} name={this.props.repertoire_name}/>
			)
		}
	}
}

export default RightMenu;