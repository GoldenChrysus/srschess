import React from "react";
import { Collapse, Descriptions } from "antd";
import ChessMaker from "../../../lib/ChessMaker";
import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { Translation } from "react-i18next";

interface PGNDataProps {
	game?: ChessControllerProps["game"]
}

interface PGNDataState {
	headers?: {
		[key: string] : string | undefined
	}
}

class PGNData extends React.Component<PGNDataProps, PGNDataState> {
	private chess = ChessMaker.create();

	updateHeaders(construction?: boolean) {
		this.chess.load_pgn(this.props.game?.pgn || "");

		const header = this.chess.header();

		if (!construction) {
			this.setState({
				headers : header
			});
		} else {
			this.state = {
				headers : header
			};
		}
	}

	constructor(props: PGNDataProps) {
		super(props);
		this.updateHeaders(true);
	}

	componentDidUpdate(prev_props: PGNDataProps) {
		if (prev_props.game?.id !== this.props.game?.id) {
			this.updateHeaders();
		}
	}

	render() {
		if (!this.props.game || !this.state.headers) {
			return null;
		}

		const items: any = [];

		for (const header in this.state.headers) {
			items.push(
				<Descriptions.Item label={header} key={"pgn-header-" + header}>{this.state.headers[header]}</Descriptions.Item>
			);
		}

		return (
			<Translation ns="database">
				{t => (
					<Collapse accordion bordered={false} defaultActiveKey="pgn-data-panel">
						<Collapse.Panel id="pgn-data-panel" header={t("pgn_data")} key="pgn-data-panel">
							<Descriptions className="max-h-40" layout="vertical" bordered>
								{items}
							</Descriptions>
						</Collapse.Panel>
					</Collapse>
				)}
			</Translation>
		);
	}
}

export default PGNData;