import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloConsumer, useQuery } from "@apollo/client";

import ChessController from "../controllers/ChessController";
import { CollectionQueryData } from "../lib/types/models/Collection";
import { GET_COLLECTION } from "../api/queries";
import { runInAction } from "mobx";
import ChessState from "../stores/ChessState";

interface GameDatabaseRouteParams {
	collection_slug?: string
	game_slug?: string
	master_game_id?: string
}

function GameDatabaseRoute() {
	const { collection_slug, game_slug, master_game_id } = useParams<GameDatabaseRouteParams>();
	const [ move_searching, setMoveSearching ] = useState<boolean>(false);

	const { loading, error, data } = useQuery<CollectionQueryData>(
		GET_COLLECTION,
		{
			variables : {
				slug : collection_slug
			},
			skip : !collection_slug
		}
	);

	const onMoveSearchChange = function(new_state: boolean) {
		setMoveSearching(new_state);
	}

	runInAction(() => ChessState.setCollection(data?.collection));

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					mode={(move_searching) ? "search" : "database"}
					collection={data?.collection}
					client={client}
					onMoveSearchChange={onMoveSearchChange}
				/>
			}
		</ApolloConsumer>
	)
};

export default GameDatabaseRoute;