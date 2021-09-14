import React from "react";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { GET_REPERTOIRE, CREATE_MOVE } from "../api/queries";
import ChessController from "../controllers/ChessController";

interface RepertoireRouteParams {
	id?: string
}

function RepertoireRoute() {
	const { id } = useParams<RepertoireRouteParams>();
	const [ createMove, {} ] = useMutation(CREATE_MOVE, {
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

	const moves: { [id: string]: {} } = {};
	const tree: { [move_num: number] : Array<any> } = {};

	if (data?.repertoire?.moves) {
		for (const move of data?.repertoire.moves) {
			moves[move.id] = move;

			if (!tree[move.moveNumber]) {
				tree[move.moveNumber] = [];
			}

			tree[move.moveNumber].push(move);
		}

		for (const move_number in tree) {
			tree[move_number].sort((a: any, b: any) => {
				if (a.sort === b.sort) {
					return 0;
				}

				return (a.sort < b.sort) ? -1 : 1;
			});
		}
	}

	console.log(tree);

	const addMove = function(move_data: any) {
		console.log(move_data);
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