import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloConsumer, useQuery } from "@apollo/client";

import ChessController from "../controllers/ChessController";
import { CollectionQueryData } from "../lib/types/models/Collection";
import { GET_COLLECTION, GET_GAME, GET_MASTER_GAME } from "../api/queries";
import { runInAction } from "mobx";
import ChessState from "../stores/ChessState";
import { MasterGameQueryData } from "../lib/types/models/MasterGame";
import { GameQueryData } from "../lib/types/models/Game";

interface GameDatabaseRouteParams {
	collection_slug?: string
	game_id?: string
	master_game_id?: string
}

function GameDatabaseRoute() {
	const { collection_slug, game_id, master_game_id } = useParams<GameDatabaseRouteParams>();
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

	const { loading: master_game_loading, error: master_game_error, data: master_game_data } = useQuery<MasterGameQueryData>(
		GET_MASTER_GAME,
		{
			variables : {
				id : master_game_id
			},
			skip : !master_game_id
		}
	);

	const { loading: game_loading, error: game_error, data: game_data } = useQuery<GameQueryData>(
		GET_GAME,
		{
			variables : {
				id : game_id
			},
			skip : !game_id
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
					game={game_data?.game ?? master_game_data?.masterGame}
					client={client}
					onMoveSearchChange={onMoveSearchChange}
				/>
			}
		</ApolloConsumer>
	)
};

export default GameDatabaseRoute;