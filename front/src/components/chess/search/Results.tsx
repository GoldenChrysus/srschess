import React from "react";
import { SearchProps, SearchState } from "../../../lib/types/SearchTypes";

import GameItem from "./GameItem";
import RepertoireItem from "./RepertoireItem";

interface ResultsProps {
	criteria: SearchState["criteria"],
	mode: SearchProps["mode"]
}

function Results(props: ResultsProps) {
	if (!props.criteria) {
		return <></>;
	}

	return <></>;
}

export default Results;