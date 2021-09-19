import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, ApolloConsumer } from "@apollo/client";

import { GET_REPERTOIRE, CREATE_MOVE } from "../api/queries";
import ChessController from "../controllers/ChessController";

interface RepertoireRouteParams {
	id?: string
}

// TODO:
// Add backup route-level cache that holds moves by ID's to use for lookup in tree building in case a subsequent move
// is not in the GET_REPERTOIRE data if a user completes another move before the query request is complete (race condition).
// May be mitigatable from Apollo manual recaching in the CREATE_MOVE mutation, but need to see if the recache occurs before
// or after the mutation request. If after, the possibility of a race condition still exists, so a route-level cache is needed.

function RepertoireRoute() {
	const { id } = useParams<RepertoireRouteParams>();
	const [ createMove ] = useMutation(CREATE_MOVE, {
		refetchQueries : [ GET_REPERTOIRE ]
	});
	const { loading, error, data } = useQuery(
		GET_REPERTOIRE,
		{
			variables : {
				id : id
			}
		}
	);

	const fens: { [key: string]: string } = {};

	if (data?.repertoire?.moves) {
		for (const move of data?.repertoire.moves) {
			const fen_key  = `${move.moveNumber}:${move.move}:${move.fen}`;

			fens[fen_key] = move.id;
		}
	}

	const addMove = function(move_data: any) {
		createMove({
			variables : {
				id           : move_data.id,
				repertoireId : data?.repertoire.id,
				moveNumber   : move_data.move_num,
				move         : move_data.move,
				fen          : move_data.fen,
				parentId     : move_data.parent_id
			}
		});
	}

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					mode="repertoire"
					repertoire={data?.repertoire}
					client={client}
					onMove={addMove}
				/>
			}
		</ApolloConsumer>
	)
};

export default RepertoireRoute;