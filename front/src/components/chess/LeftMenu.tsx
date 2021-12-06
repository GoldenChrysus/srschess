import React from "react";
import { Translation } from "react-i18next";
import { TFunction } from "i18next";
import { Collapse } from "antd";

import { ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";
import Tree from "../Tree";
import Repertoires from "./left-menu/Repertoires";

import "../../styles/components/chess/left-menu.css";
import { RepertoireModel } from "../../lib/types/models/Repertoire";
import PublicRepertoires from "./left-menu/PublicRepertoires";
import { inject } from "mobx-react";
import GameCollections from "./left-menu/GameCollections";

interface LeftMenuProps {
	repertoire?         : RepertoireModel | null
	active_uuid         : ChessControllerState["last_uuid"],
	mode                : ChessControllerProps["mode"],
	movelist            : string,
	authenticated?      : boolean,
	onMoveClick?        : Function
	onMoveSearchChange? : Function
}

@inject(stores => ({
	authenticated: (stores as any).AuthState.authenticated
}))
class LeftMenu extends React.Component<LeftMenuProps> {
	shouldComponentUpdate(prev_props: LeftMenuProps) {
		return (
			prev_props.active_uuid !== this.props.active_uuid ||
			prev_props.mode !== this.props.mode ||
			prev_props.movelist !== this.props.movelist ||
			prev_props.authenticated !== this.props.authenticated ||
			JSON.stringify(prev_props.repertoire) !== JSON.stringify(this.props.repertoire)
		);
	}

	render() {
		const default_active = [""];
		const is_repertoire  = ["repertoire", "review", "lesson"].includes(this.props.mode);

		if (is_repertoire) {
			default_active.push("personal-repertoires-panel");
			default_active.push("tree-panel");
		}

		if (this.props.mode === "database") {
			default_active.push("collections-panel");
		}

		return (
			<div key="chess-left-menu-inner" id="chess-left-menu" className="flex-1 order-3 md:order-1">
				<Translation ns={["repertoires", "database"]}>
					{
						(t) => (
							<Collapse bordered={false} defaultActiveKey={default_active}>
								{this.renderTree(t)}
								{is_repertoire && this.props.authenticated &&
									<Collapse.Panel id="personal-repertoires-panel" header={t("personal_repertoires")} key="personal-repertoires-panel">
										<Repertoires mode={this.props.mode}/>
									</Collapse.Panel>
								}
								{is_repertoire &&
									<Collapse.Panel id="public-repertoires-panel" header={t("search_public_repertoires")} key="public-repertoires-panel">
										<PublicRepertoires onMoveSearchChange={this.props.onMoveSearchChange} movelist={this.props.movelist}/>
									</Collapse.Panel>
								}
								{this.props.mode === "database" && this.props.authenticated &&
									<Collapse.Panel id="collections-panel" header={t("database:game_collections")} key="collections-panel">
										<GameCollections/>
									</Collapse.Panel>
								}
							</Collapse>
						)
					}
				</Translation>
			</div>
		);
	}

	renderTree(t: TFunction) {
		if (this.props.mode !== "repertoire" || !this.props.repertoire) {
			return null;
		}

		return (
			<Collapse.Panel id="tree-panel" header={t("move_tree")} key="tree-panel" forceRender={true}>
				<Tree key="tree" repertoire={this.props.repertoire} active_uuid={this.props.active_uuid} onMoveClick={this.props.onMoveClick}></Tree>
			</Collapse.Panel>
		);
	}
}

export default LeftMenu;