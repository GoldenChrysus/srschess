import React from "react";
import { PlanModel } from "../lib/types/models/Premium";
import Plan from "./upgrade/Plan";

const PLANS: Array<PlanModel> = [
	{
		id        : "free",
		price     : 0,
		available : true,
		piece     : "white p",
		features  : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: 2000
						}
					}
				]
			},
			{
				text : {
					key     : "opening_database_limit",
					options : {
						count : 5
					}
				}
			},
			{
				text : {
					key : "Stockfish 14 NNUE"
				}
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key : "common:view"
					},
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : 5
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:import_pgn"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : 5
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : 100
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_database"
				},
				limits : [
					{
						key     : "database_result_limit",
						options : {
							count : 10
						}
					},
					{
						key : "search:search_by_opening"
					},
					{
						key : "search:search_by_move_input"
					},
					{
						key : "search:search_by_fen"
					}
				]
			}
		]
	},
	{
		id        : "bishop",
		price     : 2.99,
		available : false,
		piece     : "black b",
		features  : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: 10000
						}
					}
				]
			},
			{
				text : {
					key     : "opening_database_limit",
					options : {
						count : 30
					}
				}
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : 10
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:save_database_games"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : 100
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : 1000
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_database"
				},
				limits : [
					{
						key     : "database_result_limit",
						options : {
							count : 25
						}
					},
					{
						key : "search:search_by_elo"
					},
					{
						key : "database:download_pgn"
					}
				]
			}
		]
	},
	{
		id        : "rook",
		price     : 5.99,
		available : false,
		piece     : "white r",
		features  : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: 30000
						}
					}
				]
			},
			{
				text : {
					key     : "opening_database_limit",
					options : {
						count : -1
					}
				}
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : 25
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:manual_api_import"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : 500
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : 2000
						}
					},
					{
						key : "database:download_pgn"
					}
				]
			},
			{
				text   : {
					key : "database:game_database"
				},
				limits : [
					{
						key     : "database_result_limit",
						options : {
							count : -1
						}
					},
					{
						key : "search:search_by_multiple_fen"
					},
					{
						key : "search:search_by_pgn"
					},
					{
						key : "search:search_by_player"
					},
					{
						key : "search:search_by_date"
					}
				]
			}
		]
	},
	{
		id        : "monarch",
		price     : 8.99,
		available : false,
		piece     : "black q",
		features  : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: "∞"
						}
					}
				]
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : "∞"
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:automatic_api_import"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : "∞"
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : -1
						}
					}
				]
			}
		]
	}
];

function Upgrade() {
	const plans = [];

	for (const plan of PLANS) {
		plans.push(
			<Plan key={"plan-" + plan.id} plan={plan}/>
		)
	}
	return (
		<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{plans}
		</div>
	);
}

export default Upgrade;