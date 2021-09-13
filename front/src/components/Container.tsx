import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Chessboard from "./Chessboard";
import RepertoireRoute from "../routes/RepertoireRoute";

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
							<RepertoireRoute repertoires={Repertoire.store}/>
						</Route>
					</Switch>
				</Router>
			</MainLayout>
		);
	}
}

export default Container;