import React from "react";
import { Translation } from "react-i18next";
import { ChessSearchResultItemModel } from "../../../lib/types/models/ChessSearch";

import SearchItem from "./SearchItem";

interface MasterGameItemProps {
	record: ChessSearchResultItemModel
}

class MasterGameItem extends React.Component<MasterGameItemProps> {
	render() {
		const result = (this.props.record.result === 0)
			? "0-1"
			: ((this.props.record.result === 1)
				? "1-0"
				: ((this.props.record.result === 2)
					? "1/2-1/2"
					: "N/A"));
		return (
			<SearchItem route={"/game-database/master-game/" + this.props.record.slug}>
				<div className="flex">
					<Translation ns={["chess", "common"]}>
						{(t) => (
							<>
								<div className="flex-1 font-bold">{this.props.record.name}</div>
								<div className="flex-initial text-right">{result}</div>
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

export default MasterGameItem;