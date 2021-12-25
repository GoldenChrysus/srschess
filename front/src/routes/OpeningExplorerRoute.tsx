import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@apollo/client";
import { GET_ECO } from "../api/queries";
import { EcoPositionQueryData } from "../lib/types/models/EcoPosition";
import OpeningExplorer from "../components/OpeningExplorer";
import { useTranslation } from "react-i18next";

function OpeningExplorerRoute() {
	const { t } = useTranslation("openings");
	const { loading, error, data } = useQuery<EcoPositionQueryData>(GET_ECO);

	return (
		<>
			<Helmet>
				<title>{t("openings_explorer")}</title>
			</Helmet>
			<OpeningExplorer openings={data?.ecoPositions}/>
		</>
	);
}

export default OpeningExplorerRoute;