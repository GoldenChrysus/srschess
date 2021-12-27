import React, { useState } from "react";
import { ApolloConsumer } from "@apollo/client";
import ChessController from "../../controllers/ChessController";
import { DEMO_MASTER_GAMES } from "../../lib/constants/chess";
import { GameModel } from "../../lib/types/models/Game";
import Results from "../chess/search/Results";

function DatabaseDemo() {
	const [ game, setGame ] = useState<GameModel>(DEMO_MASTER_GAMES[0]);

	const onResultClick = function(slug: GameModel["slug"]) {
		for (const game of DEMO_MASTER_GAMES) {
			if (game.slug === slug) {
				return setGame(game);
			}
		}
	}

	return (
		<div className="flex">
			<div className="flex-initial w-1/4 pr-8">
				<Results demo={true} record={game} mode="master_games" criteria={{mode : "master_games", data : {}}} onResultClick={onResultClick}/>
			</div>
			<div className="flex-1">
				<ApolloConsumer>
					{client => 
						<ChessController
							key="chess-controller"
							demo={true}
							mode="database"
							client={client}
							game={game}
							arrows={{}}
						/>
					}
				</ApolloConsumer>
			</div>
		</div>
	);
}

export default DatabaseDemo;