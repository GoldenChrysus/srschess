import React from "react";
import { observer } from "mobx-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import AuthState from "../stores/AuthState";

import MainLayout from "./MainLayout";
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
							<RepertoireRoute mode="repertoire"/>
						</Route>
						<Route exact path="/lessons/:id?">
							<RepertoireRoute mode="lesson"/>
						</Route>
						<Route exact path="/reviews/:id?">
							<RepertoireRoute mode="review"/>
						</Route>
					</Switch>
				</MainLayout>
			</Router>
		);
	}
}

export default observer(Container);