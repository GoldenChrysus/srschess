import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_REPERTOIRE } from "../api/queries";

import ChessController from "../controllers/ChessController";
import { Spin } from "antd";

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
		<Spin size="large" spinning={loading}>
			<ChessController
				mode="repertoire"
				repertoire={data?.repertoire}
			/>
		</Spin>
	)
};

export default RepertoireRoute;