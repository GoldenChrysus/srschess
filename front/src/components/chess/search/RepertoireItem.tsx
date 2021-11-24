import React from "react";
import { Translation } from "react-i18next";
import { ChessSearchResultItemModel } from "../../../lib/types/models/ChessSearch";

import SearchItem from "./SearchItem";

interface RepertoireItemProps {
	record: ChessSearchResultItemModel
}

class RepertoireItem extends React.Component<RepertoireItemProps> {
	render() {
		return (
			<SearchItem route={"/repertoires/" + this.props.record.slug}>
				<div className="flex">
					<Translation ns={["chess", "common"]}>
						{(t) => (
							<>
								<div className="flex-1 font-bold">{this.props.record.name}</div>
								<div className="flex-initial text-right">{this.props.record.moveCount} {t("move", { count : this.props.record.moveCount })}</div>
							</>
						)}
					</Translation>
				</div>
				<div className="text-xs">
					{(new Date(this.props.record.createdAt)).toLocaleDateString()}
				</div>
			</SearchItem>
		)
	}
}

export default RepertoireItem;