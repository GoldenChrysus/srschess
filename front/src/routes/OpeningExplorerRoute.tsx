import React from "react";
import { Helmet } from "react-helmet";
import { ApolloConsumer, useQuery } from "@apollo/client";
import { GET_ECO, GET_ECOS } from "../api/queries";
import { EcoPositionQueryData, EcoPositionsQueryData } from "../lib/types/models/EcoPosition";
import OpeningExplorer from "../components/OpeningExplorer";
import { useTranslation } from "react-i18next";
import { createOpeningExplorerRouteMeta } from "../helpers";
import { useParams } from "react-router-dom";
import ChessController from "../controllers/ChessController";

interface OpeningExplorerRouteParams {
	slug?: string
}

function OpeningExplorerRoute() {
	const { slug }                 = useParams<OpeningExplorerRouteParams>();
	const { t }                    = useTranslation("openings");
	const { data } = useQuery<EcoPositionsQueryData>(
		GET_ECOS,
		{
			skip : !!slug
		}
	);
	const { data: opening_data } = useQuery<EcoPositionQueryData>(
		GET_ECO,
		{
			variables : {
				slug : slug
			},
			skip : !slug
		}
	);

	const opening = opening_data?.ecoPosition;
	const meta    = createOpeningExplorerRouteMeta(t, opening);

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
			{!slug && <OpeningExplorer openings={data?.ecoPositions}/>}
			{
				slug &&
				<ApolloConsumer>
					{client => 
						<ChessController
							demo={false}
							key="chess-controller"
							mode="opening"
							game={opening}
							client={client}
						/>
					}
				</ApolloConsumer>
			}
		</>
	);
}

export default OpeningExplorerRoute;