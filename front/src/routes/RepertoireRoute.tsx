import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, ApolloConsumer } from "@apollo/client";

import { GET_REPERTOIRE, GET_REPERTOIRE_LESSONS, CREATE_MOVE, TRANSPOSE_MOVE, CREATE_REVIEW, GET_REPERTOIRE_REVIEWS } from "../api/queries";
import ChessController from "../controllers/ChessController";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";
import { RepertoireModel, RepertoireMoveModel, RepertoireQueryData, RepertoireReviewModel } from "../lib/types/models/Repertoire";
import RepertoireStore from "../stores/RepertoireStore";

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

	const prev_data = useRef<RepertoireQueryData | undefined>();

	switch (props.mode) {
		case "repertoire":
			main_query = GET_REPERTOIRE;

			break;

		case "lesson":
			main_query = GET_REPERTOIRE_LESSONS;

			break;

		case "review":
			main_query = GET_REPERTOIRE_REVIEWS;

			break;
	}

	const { slug } = useParams<RepertoireRouteParams>();
	const [ createMove ] = useMutation(CREATE_MOVE, {
		refetchQueries : [ main_query ]
	});
	const [ transposeMove ] = useMutation(TRANSPOSE_MOVE, {
		refetchQueries : [ main_query ]
	});
	const [ createReview ] = useMutation(CREATE_REVIEW);
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

	useEffect(() => {
		if (data?.repertoire && data.repertoire.id !== prev_data?.current?.repertoire?.id) {
			RepertoireStore.add(data.repertoire);
		}

		prev_data.current = data;
	});

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
					onReview={doReview}
					arrows={arrows}
				/>
			}
		</ApolloConsumer>
	)
};

export default RepertoireRoute;