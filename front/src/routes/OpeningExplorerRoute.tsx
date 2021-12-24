import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ECO } from "../api/queries";
import { EcoPositionQueryData } from "../lib/types/models/EcoPosition";
import OpeningExplorer from "../components/OpeningExplorer";

function OpeningExplorerRoute() {
	const { loading, error, data } = useQuery<EcoPositionQueryData>(GET_ECO);

	return (
		<OpeningExplorer openings={data?.ecoPositions}/>
	);
}

export default OpeningExplorerRoute;