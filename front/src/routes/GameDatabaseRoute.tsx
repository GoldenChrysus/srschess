import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloConsumer } from "@apollo/client";

import ChessController from "../controllers/ChessController";

interface GameDatabaseRouteParams {
	slug?: string
}

function GameDatabaseRoute() {
	const { slug } = useParams<GameDatabaseRouteParams>();
	const [ move_searching, setMoveSearching ] = useState<boolean>(false);

	const onMoveSearchChange = function(new_state: boolean) {
		setMoveSearching(new_state);
	}

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					mode={(move_searching) ? "search" : "database"}
					client={client}
					onMoveSearchChange={onMoveSearchChange}
				/>
			}
		</ApolloConsumer>
	)
};

export default GameDatabaseRoute;