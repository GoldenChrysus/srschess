import { ApolloConsumer } from "@apollo/client";
import React, { useState } from "react";
import ChessController from "../../controllers/ChessController";
import { generateUUID, getMove, getMoveSimple } from "../../helpers";
import { RepertoireModel } from "../../lib/types/models/Repertoire";
import Tree from "../Tree";

const REPERTOIRE: RepertoireModel = {
	id: -1,
	name: "Demo",
	public: true,
	side: "white",
	slug: "demo",
	userOwned: true,
	moves: [
		{
			id         : "-1",
			move       : "e4",
			moveNumber : 10,
			sort       : 0,
			uci        : "e2e4",
			fen        : "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
		},
		{
			id         : "-2",
			move       : "e5",
			parentId   : "-1",
			moveNumber : 15,
			sort       : 0,
			uci        : "e7e5",
			fen        : "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
		},
		{
			id         : "-3",
			move       : "Nf3",
			parentId   : "-2",
			moveNumber : 20,
			sort       : 0,
			uci        : "g1f3",
			fen        : "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
		},
		{
			id         : "-8",
			move       : "Ke2",
			parentId   : "-2",
			moveNumber : 20,
			sort       : 1,
			uci        : "e1e2",
			fen        : "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2"
		},
		{
			id         : "-4",
			move       : "Nf6",
			parentId   : "-3",
			moveNumber : 25,
			sort       : 0,
			uci        : "g8f6",
			fen        : "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
		},
		{
			id         : "-5",
			move       : "Bc4",
			parentId   : "-4",
			moveNumber : 30,
			sort       : 0,
			uci        : "f1c4",
			fen        : "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"
		},
		{
			id         : "-6",
			move       : "Bc5",
			parentId   : "-5",
			moveNumber : 35,
			sort       : 0,
			uci        : "f8c5",
			fen        : "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
		},
		{
			id         : "-7",
			move       : "b4",
			parentId   : "-6",
			moveNumber : 40,
			sort       : 0,
			uci        : "b2b4",
			fen        : "rnbqk2r/pppp1ppp/5n2/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4"
		},
	]
};

let next_sort = 2;

function RepertoireDemo() {
	const [ repertoire, setRepertoire ] = useState(REPERTOIRE);
	const id_map: {[old_id: string]: string} = {};

	for (let i = 0; i < REPERTOIRE.moves!.length; i++) {
		const move      = REPERTOIRE.moves![i];
		const id        = move.id;
		const parent_id = move.parentId;

		if (!isNaN(+id) && +id < 0) {
			const new_id = generateUUID(move.moveNumber, move.move, move.fen, REPERTOIRE.id);

			id_map[id] = new_id;

			REPERTOIRE.moves![i].id = new_id;
		}

		if (parent_id && !isNaN(+parent_id) && +parent_id < 0) {
			if (id_map[parent_id]) {
				REPERTOIRE.moves![i].parentId = id_map[parent_id];
			}
		}
	}

	const arrows: { [key: string]: Array<any> } = {};

	if (REPERTOIRE.moves) {
		for (const move of REPERTOIRE.moves) {
			if (!arrows[move.id]) {
				arrows[move.id] = [];
			}

			const parent_id = move.parentId || "root";

			if (!arrows[parent_id]) {
				arrows[parent_id] = [];
			}

			arrows[parent_id].push(move.uci);
		}
	}

	const addMove = function(move: any) {
		if (getMoveSimple(REPERTOIRE.moves!, move.id)) {
			return;
		}

		REPERTOIRE.moves!.push(
			{
				id: move.id,
				moveNumber: move.move_num,
				move: move.move,
				fen: move.fen,
				uci: move.uci,
				parentId: move.parent_id,
				sort: next_sort++
			}
		);

		setRepertoire({...REPERTOIRE});
	}

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					demo={true}
					mode="repertoire"
					repertoire={repertoire}
					client={client}
					onMove={addMove}
					arrows={arrows}
				/>
			}
		</ApolloConsumer>
	);
}

export default RepertoireDemo;