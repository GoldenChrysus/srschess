import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ChessController from "./lib/controllers/ChessController";
import { Repertoire as RepertoireModel } from "../api/models";

interface RepertoireState {
	repertoire?: any
};

class Repertoire extends React.Component<any, RepertoireState> {
	constructor(props: any) {
		super(props);

		this.state = {};
	}

	async componentDidMount() {
		const id = this.props.match.params.id;

		this.setState({
			repertoire : (id) ? await RepertoireModel.byId(id) : undefined
		});
	}

	render() {
		return (
			<ChessController>

			</ChessController>
		);
	}
}

export default withRouter(observer(Repertoire));