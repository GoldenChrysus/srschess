import React from "react";
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";

import MainLayout from "./MainLayout";
import Chessboard from "./Chessboard";
import RepertoireComponent from "./Repertoire";

import { Repertoire } from "../api/models/";

class Container extends React.Component {
	render() {
		return (
			<MainLayout>
				<Router>
					<Switch>
						<Route exact path="/">
							<Chessboard/>
						</Route>
						<Route exact path="/repertoires/:id?">
							<RepertoireComponent repertoires={Repertoire.store}/>
						</Route>
					</Switch>
				</Router>
			</MainLayout>
		);
	}
}

export default Container;