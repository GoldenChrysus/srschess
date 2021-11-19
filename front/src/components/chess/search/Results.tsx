import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CHESS_SEARCH } from "../../../api/queries";
import { ChessSearchQueryData } from "../../../lib/types/models/ChessSearch";
import { SearchProps, SearchState } from "../../../lib/types/SearchTypes";

import GameItem from "./GameItem";
import RepertoireItem from "./RepertoireItem";

interface ResultsProps {
	criteria: SearchState["criteria"],
	mode: SearchProps["mode"]
}

function Results(props: ResultsProps) {
	const { loading, error, data } = useQuery<ChessSearchQueryData>(
		GET_CHESS_SEARCH,
		{
			variables : {
				criteria : props.criteria
			},
			skip : !props.criteria?.mode
		}
	);

	if (!props.criteria) {
		return <></>;
	}

	console.log(data);

	return <></>;
}

export default Results;