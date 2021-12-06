import React from "react";
import { useParams } from "react-router-dom";
import { ApolloConsumer } from "@apollo/client";

import ChessController from "../controllers/ChessController";

interface GameDatabaseRouteParams {
	slug?: string
}

function GameDatabaseRoute() {
	const { slug } = useParams<GameDatabaseRouteParams>();

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					mode="database"
					client={client}
				/>
			}
		</ApolloConsumer>
	)
};

export default GameDatabaseRoute;