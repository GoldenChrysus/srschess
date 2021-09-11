import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ChessController from "../controllers/ChessController";
import { Repertoire } from "../../../api/models";

interface RepertoireRouteState {
	repertoire?: any
};

class RepertoireRoute extends React.Component<any, RepertoireRouteState> {
	constructor(props: any) {
		super(props);

		this.state = {};
	}

	async componentDidMount() {
		const id = this.props.match.params.id;

		this.setState({
			repertoire : (id) ? await Repertoire.byId(id) : undefined
		});
	}

	render() {
		return (
			<ChessController mode="repertoire" repertoire={this.state.repertoire} repertoires={this.props.repertoires}/>
		);
	}
}

export default withRouter(observer(RepertoireRoute));