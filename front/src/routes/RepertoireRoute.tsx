import React from "react";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { GET_REPERTOIRE, CREATE_MOVE } from "../api/queries";
import ChessController from "../controllers/ChessController";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";

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

	console.log(data);
	console.log(error);

	const moves: { [id: string]: any } = {};
	const tree: ChessControllerProps["tree"] = {};
	const fens: { [key: string]: string } = {};

	if (data?.repertoire?.moves) {
		for (const move of data?.repertoire.moves) {
			moves[move.id] = move;

			const fen_key  = `${move.moveNumber}:${move.move}:${move.fen}`;
			const tmp_move = {...move};

			fens[fen_key] = move.id;

			if (!tree[tmp_move.moveNumber]) {
				tree[tmp_move.moveNumber] = {};
			}

			tmp_move.moves = [];

			tree[tmp_move.moveNumber][tmp_move.sort] = tmp_move;

			if (tmp_move.parentId) {
				const parent = moves[tmp_move.parentId];

				tree[parent.moveNumber][parent.sort].moves.push({
					sort       : tmp_move.sort,
					moveNumber : tmp_move.moveNumber
				});
			}
		}
	}

	const addMove = function(move_data: any) {
		// console.log(move_data);
		createMove({
			variables : {
				id           : move_data.id,
				repertoireId : data?.repertoire.id,
				moveNumber   : move_data.move_num,
				move         : move_data.move,
				fen          : move_data.fen,
				sort         : move_data.sort,
				parentId     : move_data.parent_id
			}
		});
	}

	return (
		<ChessController
			mode="repertoire"
			repertoire={data?.repertoire}
			moves={moves}
			tree={tree}
			onMove={addMove}
		/>
	)
};

export default RepertoireRoute;