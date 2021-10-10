import React from "react";
import { Table} from "antd";
import { useApolloClient, useQuery } from "@apollo/client";

import { ChessControllerState } from "../../lib/types/ChessControllerTypes";
import { getMove, getIndexFromDBMoveNum } from "../../helpers/";
import { GET_MASTER_MOVE } from "../../api/queries";
import { useTranslation } from "react-i18next";

interface MasterMoveListProps {
	last_uuid : ChessControllerState["last_uuid"],
}

function MasterMoveList(props: MasterMoveListProps) {
	const client = useApolloClient();
	const { t }  = useTranslation("chess");
	const move   = getMove(client, props.last_uuid);
	const num    = (move) ? getIndexFromDBMoveNum(move.moveNumber) : -1;

	const { loading, error, data } = useQuery(
		GET_MASTER_MOVE,
		{
			variables : {
				move       : move?.move ?? null,
				moveNumber : num
			},
			nextFetchPolicy : "cache-only"
		}
	);

	return (
		<Table dataSource={data?.masterMoves} loading={loading} size="small" pagination={{ pageSize: 7 }}>
			<Table.Column title={t("move")} dataIndex="move" key="move"/>
			<Table.Column
				title={t("total_games")}
				key="total_games"
				render={(text, record: any) => (
					(record.white + record.black + record.draw).toLocaleString()
				)}
			/>
			<Table.Column
				title={t("outcome_percent")}
				key="outcome_percent"
				render={(text, record: any) => {
					const total = record.white + record.black + record.draw;
					const white = record.white / total * 100;
					const black = record.black / total * 100;
					const draw  = record.draw / total * 100;
					return (
						<div className="w-full h-full">
							<div style={{ width: white + "%" }} className="inline-block bg-gray-300 text-gray-900 px-2 whitespace-nowrap">
								{Math.round(white)}%
							</div>
							<div style={{ width: draw + "%" }} className="inline-block bg-gray-500 px-2 whitespace-nowrap">
								{Math.round(draw)}%
							</div>
							<div style={{ width: black + "%" }} className="inline-block bg-gray-900 px-2 whitespace-nowrap">
								{Math.round(black)}%
							</div>
						</div>
					);
				}}
			/>
			<Table.Column title={t("average_elo")} dataIndex="elo" key="elo"/>
		</Table>
	)
}

export default MasterMoveList;