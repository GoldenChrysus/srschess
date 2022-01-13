import React from "react";
import { Button, Descriptions } from "antd";
import ChessMaker from "../../../lib/ChessMaker";
import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { Translation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";

interface PGNDataProps extends PropsFromRedux {
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

		this.downloadPGN = this.downloadPGN.bind(this);
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
					<>
						{
							this.props.authenticated &&
							this.props.tier >= 1 &&
							<Button type="default" className="m-auto my-2" style={{ display: "block" }} onClick={this.downloadPGN}>{t("download_pgn")}</Button>
						}
						<Descriptions layout="vertical" bordered>
							{items}
						</Descriptions>
					</>
				)}
			</Translation>
		);
	}

	downloadPGN() {
		if (!this.props.game) {
			return;
		}

		const blob = new Blob([this.props.game.pgn], {
			type : "text/plain"
		});
		const url = window.URL.createObjectURL(blob);
		const a   = document.createElement("a");

		a.href     = url;
		a.download = "game.pgn";

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated,
	tier          : state.Auth.tier
});
const connector     = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PGNData);