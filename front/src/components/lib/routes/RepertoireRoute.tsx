import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ChessController from "../controllers/ChessController";
import { Repertoire, Move } from "../../../api/models";

interface RepertoireRouteState {
	repertoire?: any
}

class RepertoireRoute extends React.Component<any, RepertoireRouteState> {
	constructor(props: any) {
		super(props);

		this.state = {};
	}

	async componentDidMount() {
		const id = this.props.match.params.id;

		if (id) {
			Move.store.empty();
			await Move.where(
				{
					relation : Repertoire.type,
					record   : {
						type : Repertoire.type,
						id   : id
					}
				}
			);
		}

		this.setState({
			repertoire : (id) ? await Repertoire.byId(id) : undefined
		});
	}

	render() {
		return (
			<ChessController
				mode="repertoire"
				repertoire={this.state.repertoire}
				repertoires={this.props.repertoires}
				moves={Move.store}
			/>
		);
	}
}

export default withRouter(observer(RepertoireRoute));