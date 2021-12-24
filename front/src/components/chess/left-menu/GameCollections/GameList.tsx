import React from "react";
import { useHistory } from "react-router-dom";
import { Table } from "antd";
import { Observer } from "mobx-react";
import { CollectionModel } from "../../../../lib/types/models/Collection";
import Game from "./GameList/Game";

interface GameListProps {
	collection_slug: CollectionModel["slug"],
	games: CollectionModel["games"]
}

function GameList(props: GameListProps) {
	const history = useHistory();

	return (
		<Observer>
			{() => (
				<div className="w-full">
					<Table
						dataSource={props.games ?? []}
						pagination={{ pageSize : 10 }}
						rowClassName="cursor-pointer"
						showHeader={false}
						onRow={(record, index) => {
							return {
								onClick : e => {
									history.push("/game-database/collection/" + props.collection_slug + "/game/" + record.id);
								}
							}
						}}
					>
						<Table.Column
							render={(text, record: any) => {
								return <Game game={record}/>
							}}
						/>
					</Table>
				</div>
			)}
		</Observer>
	);
}

export default GameList;