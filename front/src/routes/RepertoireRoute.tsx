import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, ApolloConsumer } from "@apollo/client";

import { GET_REPERTOIRE, GET_REPERTOIRE_LESSONS, CREATE_MOVE, TRANSPOSE_MOVE } from "../api/queries";
import ChessController from "../controllers/ChessController";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";

interface RepertoireRouteParams {
	id?: string,
	mode: ChessControllerProps["mode"]
}

// TODO:
// Add backup route-level cache that holds moves by ID's to use for lookup in tree building in case a subsequent move
// is not in the GET_REPERTOIRE data if a user completes another move before the query request is complete (race condition).
// May be mitigatable from Apollo manual recaching in the CREATE_MOVE mutation, but need to see if the recache occurs before
// or after the mutation request. If after, the possibility of a race condition still exists, so a route-level cache is needed.

function RepertoireRoute(props: RepertoireRouteParams) {
	let main_query = GET_REPERTOIRE;

	switch (props.mode) {
		case "repertoire":
			main_query = GET_REPERTOIRE;

			break;

		case "lesson":
			main_query = GET_REPERTOIRE_LESSONS;

			break;
	}

	const { id } = useParams<RepertoireRouteParams>();
	const [ createMove ] = useMutation(CREATE_MOVE, {
		refetchQueries : [ main_query ]
	});
	const [ transposeMove ] = useMutation(TRANSPOSE_MOVE, {
		refetchQueries : [ main_query ]
	});
	const { loading, error, data } = useQuery(
		main_query,
		{
			variables : {
				id : id
			},
			skip : !id
		}
	);

	const fens: { [key: string]: string } = {};
	const arrows: { [key: string]: Array<any> } = {};

	if (data?.repertoire?.moves) {
		for (const move of data?.repertoire.moves) {
			const fen_key = move.moveNumber + ":" + move.move + ":" + move.fen;

			fens[fen_key] = move.id;

			if (!arrows[move.id]) {
				arrows[move.id] = [];
			}

			const parent_id = move.parentId || "root";

			if (!arrows[parent_id]) {
				arrows[parent_id] = [];
			}

			arrows[parent_id].push(move.uci);
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
				uci          : move_data.uci,
				parentId     : move_data.parent_id
			}
		});
	}

	const setTransposition = function(current_uuid: string, prev_uuid: string) {
		transposeMove({
			variables : {
				id              : prev_uuid,
				transpositionId : current_uuid
			}
		});
	}

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					mode={props.mode}
					repertoire={data?.repertoire}
					client={client}
					onMove={addMove}
					onTransposition={setTransposition}
					arrows={arrows}
				/>
			}
		</ApolloConsumer>
	)
};

export default RepertoireRoute;