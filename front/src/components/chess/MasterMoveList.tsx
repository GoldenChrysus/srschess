import React from "react";
import { Table} from "antd";
import { useQuery } from "@apollo/client";

import { ChessControllerState } from "../../lib/types/ChessControllerTypes";
import { GET_MASTER_MOVE } from "../../api/queries";
import { useTranslation } from "react-i18next";

interface MasterMoveListProps {
	fen         : ChessControllerState["fen"],
	onMoveClick : Function
}

function MasterMoveList(props: MasterMoveListProps) {
	const { t } = useTranslation("chess");

	const { loading, error, data } = useQuery(
		GET_MASTER_MOVE,
		{
			variables : {
				fen : props.fen
			},
			nextFetchPolicy : "cache-only"
		}
	);

	return (
		<Table
			dataSource={data?.masterMoves}
			loading={loading}
			size="small"
			pagination={{ pageSize: 7 }}
			rowClassName="cursor-pointer"
			onRow={(record, index) => {
				return {
					onClick : e => props.onMoveClick(undefined, record.move)
				}
			}}
		>
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
							<div style={{ width: white + "%" }} className="inline-block bg-gray-300 text-gray-900 whitespace-nowrap overflow-hidden">
								<span className="px-2">{Math.round(white)}%</span>
							</div>
							<div style={{ width: draw + "%" }} className="inline-block bg-gray-500 whitespace-nowrap overflow-hidden">
								<span className="px-2">{Math.round(draw)}%</span>
							</div>
							<div style={{ width: black + "%" }} className="inline-block bg-gray-900 whitespace-nowrap overflow-hidden">
								<span className="px-2">{Math.round(black)}%</span>
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