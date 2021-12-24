import React, { useState } from "react";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import { EcoPositionModel } from "../../../lib/types/models/EcoPosition";
import Chessboard from "../../Chessboard";

interface OpeningPaginatorProps {
	openings: Array<EcoPositionModel>
}

const PAGE_SIZE = 20;

function OpeningPaginator(props: OpeningPaginatorProps) {
	const [ start, setStart ] = useState(0);
	const boards = [];

	for (let i = start; i < start + PAGE_SIZE; i++) {
		const opening = props.openings[i];

		if (!opening) {
			break;
		}

		boards.push(
			<Link type="div" className="board-100w" to={"/openings-explorer/" + opening.slug}>
				<h1 style={{ height : "44px", maxHeight : "44px", WebkitLineClamp : 2, WebkitBoxOrient : "vertical", display: "-webkit-box" }} className="overflow-ellipsis overflow-hidden">
					{opening.code}: {opening.name}
				</h1>
				<Chessboard
					key={"opening-" + opening.id}
					mode="static"
					fen={opening.fen}
					pgn={opening.pgn}
					onMove={() => ""}
					children={[]}
					queue_item={undefined}
					quizzing={false}
				/>
			</Link>
		);
	}

	const onPage = (page: number) => {
		setStart((page - 1) * PAGE_SIZE);
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-12 gap-4">
				{boards}
			</div>
			<div className="mt-4">
				<Pagination defaultCurrent={1} total={props.openings.length} pageSize={PAGE_SIZE} onChange={onPage} showSizeChanger={false}/>
			</div>
		</>
	);
}

export default OpeningPaginator;