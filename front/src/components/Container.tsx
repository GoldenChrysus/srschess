import React from "react";
import { observer } from "mobx-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import RepertoireRoute from "../routes/RepertoireRoute";
import GameDatabaseRoute from "../routes/GameDatabaseRoute";

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

						<Route exact path="/repertoires/:slug?">
							<RepertoireRoute mode="repertoire"/>
						</Route>
						<Route exact path="/lessons/:slug?">
							<RepertoireRoute mode="lesson"/>
						</Route>
						<Route exact path="/reviews/:slug?">
							<RepertoireRoute mode="review"/>
						</Route>

						<Route exact path="/game-database/">
							<GameDatabaseRoute/>
						</Route>
						<Route exact path="/game-database/collection/:collection_slug">
							<GameDatabaseRoute/>
						</Route>
						<Route exact path="/game-database/collection/:collection_slug/game/:game_id">
							<GameDatabaseRoute/>
						</Route>
						<Route exact path="/game-database/master-game/:master_game_id">
							<GameDatabaseRoute/>
						</Route>
					</Switch>
				</MainLayout>
			</Router>
		);
	}
}

export default observer(Container);