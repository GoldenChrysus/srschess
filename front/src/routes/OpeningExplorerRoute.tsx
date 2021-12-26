import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@apollo/client";
import { GET_ECO } from "../api/queries";
import { EcoPositionQueryData } from "../lib/types/models/EcoPosition";
import OpeningExplorer from "../components/OpeningExplorer";
import { useTranslation } from "react-i18next";
import { createOpeningExplorerRouteMeta } from "../helpers";

function OpeningExplorerRoute() {
	const { t } = useTranslation("openings");
	const { loading, error, data } = useQuery<EcoPositionQueryData>(GET_ECO);

	const meta = createOpeningExplorerRouteMeta(t);

	return (
		<>
			<Helmet>
				<title>{meta.title}</title>
				<meta name="description" content={meta.description}/>
				<link rel="canonical" href={meta.url}/>
				<meta property="og:title" content={meta.og_title}/>
				<meta property="og:description" content={meta.description}/>
				<meta property="og:url" content={meta.url}/>
				<meta property="twitter:title" content={meta.og_title}/>
				<meta property="twitter:description" content={meta.description}/>
			</Helmet>
			<OpeningExplorer openings={data?.ecoPositions}/>
		</>
	);
}

export default OpeningExplorerRoute;