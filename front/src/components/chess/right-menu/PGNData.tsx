import React from "react";
import { Descriptions } from "antd";
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

	processHeaders(construction?: boolean) {
		this.chess.load_pgn(this.props.game?.pgn || "");

		const header = this.chess.header();

		if (construction) {
			return header;
		}

		this.setState({
			headers : header
		});
	}

	constructor(props: PGNDataProps) {
		super(props);

		const header = this.processHeaders(true);

		this.state = {
			headers : header
		};
	}

	componentDidUpdate(prev_props: PGNDataProps) {
		if (prev_props.game?.id !== this.props.game?.id) {
			this.processHeaders();
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
					<Descriptions layout="vertical" bordered>
						{items}
					</Descriptions>
				)}
			</Translation>
		);
	}
}

export default PGNData;