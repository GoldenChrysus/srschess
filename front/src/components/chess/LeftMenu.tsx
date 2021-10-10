import React from "react";
import { observer } from "mobx-react";
import { Translation } from "react-i18next";
import { TFunction } from "i18next";
import { Collapse } from "antd";

import { ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";
import Tree from "../Tree";
import Repertoires from "./left-menu/Repertoires";

import "../../styles/components/chess/left-menu.css";
import ChessState from "../../stores/ChessState";

interface LeftMenuProps {
	moves       : ChessControllerState["moves"],
	active_uuid : ChessControllerState["last_uuid"],
	mode        : ChessControllerProps["mode"],
	onMoveClick : Function
}

class LeftMenu extends React.Component<LeftMenuProps> {
	render() {
		const default_active = ["personal-repertoires-panel"];

		if (this.props.mode === "repertoire") {
			default_active.push("tree-panel");
		}

		return (
			<div key="chess-left-menu-inner" id="chess-left-menu" className="flex-1 order-2 md:order-1">
				<Translation ns={["repertoires"]}>
					{
						(t) => (
							<Collapse bordered={false} defaultActiveKey={default_active}>
								{this.renderTree(t)}
								<Collapse.Panel id="personal-repertoires-panel" header={t("personal_repertoires")} key="personal-repertoires-panel">
									<Repertoires mode={this.props.mode}/>
								</Collapse.Panel>
							</Collapse>
						)
					}
				</Translation>
			</div>
		);
	}

	renderTree(t: TFunction) {
		if (this.props.mode !== "repertoire") {
			return null;
		}

		return (
			<Collapse.Panel id="tree-panel" header={t("move_tree")} key="tree-panel" forceRender={true}>
				<Tree key="tree" moves={this.props.moves} active_uuid={this.props.active_uuid} onMoveClick={this.props.onMoveClick}></Tree>
			</Collapse.Panel>
		);
	}
}

export default observer(LeftMenu);