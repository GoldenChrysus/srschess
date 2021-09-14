import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Chessboard from "./Chessboard";
import RepertoireRoute from "../routes/RepertoireRoute";

class Container extends React.Component {
	render() {
		return (
			<Router>
				<MainLayout>				
					<Switch>
						<Route exact path="/">
							<div>
								Hello<br/>
							</div>
						</Route>
						<Route exact path="/repertoires/:id?">
							<RepertoireRoute/>
						</Route>
					</Switch>
				</MainLayout>
			</Router>
		);
	}
}

export default Container;