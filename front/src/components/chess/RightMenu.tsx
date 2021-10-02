import React from "react";
import { Translation } from "react-i18next";
import { Collapse, Input } from "antd";
import { ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";

import MoveList from "./MoveList";
import Repertoire from "./right-menu/Repertoire";
import { ApolloClient } from "@apollo/client";

import "../../styles/components/chess/right-menu.css";

interface RightMenuProps {
	client: ApolloClient<object>,
	active_num?: ChessControllerState["last_num"],
	fen: string,
	moves: ChessControllerState["history"],
	mode: ChessControllerProps["mode"],
	repertoire_id?: number,
	repertoire_name?: string,
	lesson_count?: number
	review_count?: number
	onMoveClick: Function
}

class RightMenu extends React.PureComponent<RightMenuProps> {
	render() {
		return (
			<div key="chess-right-menu-inner" id="chess-right-menu" className="flex-1 order-3 md:order-3" style={{ maxHeight: "calc(100vh - 2.75rem)" }}>
				{this.renderRepertoire()}
				<MoveList client={this.props.client} active_num={this.props.active_num} fen={this.props.fen} moves={this.props.moves} onMoveClick={this.props.onMoveClick}/>
				<Translation ns="chess">
					{
						(t) => (
							<Collapse accordion bordered={false} defaultActiveKey="position-panel" className="top-border">
								<Collapse.Panel id="position-panel" header={t("position_data")} key="position-panel">
									<Input addonBefore="FEN" value={this.props.fen}/>
								</Collapse.Panel>
							</Collapse>
						)
					}
				</Translation>
			</div>
		);
	}

	renderRepertoire() {
		if (this.props.repertoire_id) {
			return (
				<Repertoire mode={this.props.mode} id={this.props.repertoire_id} name={this.props.repertoire_name} lesson_count={this.props.lesson_count} review_count={this.props.review_count}/>
			)
		}
	}
}

export default RightMenu;