import React from "react";
import ReactDOM from "react-dom";
import { Table } from "antd";
import { useQuery } from "@apollo/client";
import { GET_CHESS_SEARCH } from "../../../api/queries";
import { ChessSearchQueryData } from "../../../lib/types/models/ChessSearch";
import { SearchProps, SearchState } from "../../../lib/types/SearchTypes";

import GameItem from "./GameItem";
import RepertoireItem from "./RepertoireItem";
import { useHistory } from "react-router";

interface ResultsProps {
	criteria: SearchState["criteria"],
	mode: SearchProps["mode"]
}

function Results(props: ResultsProps) {
	const history = useHistory();
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

	return (
		<div className="w-full">
			<Table
				dataSource={data?.chessSearch}
				loading={loading}
				pagination={{ pageSize : 10 }}
				rowClassName="cursor-pointer"
				showHeader={false}
				onRow={(record, index) => {
					return {
						onClick : e => history.push("/" + props.mode + "/" + record.slug)
					}
				}}
			>
				<Table.Column
					render={(text, record: any) => {
						return (props.mode === "repertoires")
							? <RepertoireItem record={record}/>
							: <></>;
					}}
				/>
			</Table>
		</div>
	);
}

export default Results;