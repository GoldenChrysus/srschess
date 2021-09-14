import React from "react";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_REPERTOIRE } from "../api/queries";
import ChessController from "../controllers/ChessController";

interface RepertoireRouteParams {
	id?: string
}

function RepertoireRoute() {
	const { id } = useParams<RepertoireRouteParams>();
	const { loading, error, data } = useQuery(
		GET_REPERTOIRE,
		{
			variables : {
				id : id
			}
		}
	);

	return (
		<ChessController
			mode="repertoire"
			repertoire={data?.repertoire}
		/>
	)
};

export default RepertoireRoute;