import React, { useState } from "react";
import { runInAction } from "mobx";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, ApolloConsumer } from "@apollo/client";

import { GET_REPERTOIRE, GET_REPERTOIRE_QUEUES, CREATE_REPERTOIRE_MOVE, TRANSPOSE_REPERTOIRE_MOVE, CREATE_REVIEW } from "../api/queries";
import ChessController from "../controllers/ChessController";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";
import { RepertoireMoveModel, RepertoireQueryData, RepertoireReviewModel } from "../lib/types/models/Repertoire";
import ChessState from "../stores/ChessState";

interface RepertoireRouteProps {
	mode: ChessControllerProps["mode"]
}
interface RepertoireRouteParams {
	slug?: string
}

// TODO:
// Add backup route-level cache that holds moves by ID's to use for lookup in tree building in case a subsequent move
// is not in the GET_REPERTOIRE data if a user completes another move before the query request is complete (race condition).
// May be mitigatable from Apollo manual recaching in the CREATE_MOVE mutation, but need to see if the recache occurs before
// or after the mutation request. If after, the possibility of a race condition still exists, so a route-level cache is needed.

function RepertoireRoute(props: RepertoireRouteProps) {
	let main_query = GET_REPERTOIRE;

	switch (props.mode) {
		case "repertoire":
			main_query = GET_REPERTOIRE;

			break;

		case "lesson":
		case "review":
			main_query = GET_REPERTOIRE_QUEUES;

			break;
	}

	const { slug } = useParams<RepertoireRouteParams>();
	const [ createMove ] = useMutation(CREATE_REPERTOIRE_MOVE);
	const [ transposeMove ] = useMutation(TRANSPOSE_REPERTOIRE_MOVE);
	const [ createReview ] = useMutation(CREATE_REVIEW, {
		refetchQueries : [ main_query ]
	});
	const { loading, error, data } = useQuery<RepertoireQueryData>(
		main_query,
		{
			variables : {
				slug : slug
			},
			skip        : !slug,
			fetchPolicy : (props.mode === "lesson") ? "network-only" : "cache-first"
		}
	);
	const [ move_searching, setMoveSearching ] = useState<boolean>(false);

	runInAction(() => ChessState.setRepertoire(data?.repertoire));

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
				repertoireId : data?.repertoire?.id,
				moveNumber   : move_data.move_num,
				move         : move_data.move,
				fen          : move_data.fen,
				uci          : move_data.uci,
				parentId     : move_data.parent_id
			}
		});
	}

	const setTransposition = function(current_uuid: RepertoireMoveModel["id"], prev_uuid: RepertoireMoveModel["id"]) {
		transposeMove({
			variables : {
				id              : prev_uuid,
				transpositionId : current_uuid
			}
		});
	}

	const doReview = function(review: RepertoireReviewModel) {
		createReview({
			variables : review
		});
	}

	const onMoveSearchChange = function(new_state: boolean) {
		setMoveSearching(new_state);
	}

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					mode={(move_searching) ? "database" : props.mode}
					repertoire={data?.repertoire}
					client={client}
					onMove={addMove}
					onTransposition={setTransposition}
					onReview={doReview}
					arrows={arrows}
					onMoveSearchChange={onMoveSearchChange}
				/>
			}
		</ApolloConsumer>
	)
};

export default RepertoireRoute;