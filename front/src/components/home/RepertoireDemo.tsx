import React, { useState } from "react";
import { ApolloConsumer } from "@apollo/client";

import ChessController from "../../controllers/ChessController";
import { generateUUID, getMoveSimple } from "../../helpers";
import { RepertoireModel, RepertoireMoveModel } from "../../lib/types/models/Repertoire";

const REPERTOIRE: RepertoireModel = {
	id: -1,
	name: "Demo",
	public: true,
	side: "white",
	slug: "demo",
	userOwned: true,
	moves: [
		{
			"id": "70fb9959-af48-46dc-625d-15d14e5ea3a8",
			"move": "e4",
			"moveNumber": 10,
			"sort": 0,
			"uci": "e2e4",
			"fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
		},
		{
			"id": "ef1fe777-1b81-0468-0761-2e65fe00c090",
			"move": "e5",
			"parentId": "70fb9959-af48-46dc-625d-15d14e5ea3a8",
			"moveNumber": 15,
			"sort": 0,
			"uci": "e7e5",
			"fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
		},
		{
			"id": "054997ca-0016-6203-ad62-2421cb75165c",
			"move": "Nf3",
			"parentId": "ef1fe777-1b81-0468-0761-2e65fe00c090",
			"moveNumber": 20,
			"sort": 0,
			"uci": "g1f3",
			"fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
		},
		{
			"id": "a1392195-0119-6331-68a8-ec264dcedc7f",
			"move": "Ke2",
			"parentId": "ef1fe777-1b81-0468-0761-2e65fe00c090",
			"moveNumber": 20,
			"sort": 1,
			"uci": "e1e2",
			"fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2"
		},
		{
			"id": "5862f25b-a4be-9b86-1d5d-d28eb0b42c95",
			"move": "Nf6",
			"parentId": "054997ca-0016-6203-ad62-2421cb75165c",
			"moveNumber": 25,
			"sort": 0,
			"uci": "g8f6",
			"fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
		},
		{
			"id": "0567ad5a-bbb5-bd12-48da-014d00a72bcd",
			"move": "Bc4",
			"parentId": "5862f25b-a4be-9b86-1d5d-d28eb0b42c95",
			"moveNumber": 30,
			"sort": 0,
			"uci": "f1c4",
			"fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"
		},
		{
			"id": "a2528d48-48e5-2aae-6bde-ec05f76909cc",
			"move": "Bc5",
			"parentId": "0567ad5a-bbb5-bd12-48da-014d00a72bcd",
			"moveNumber": 35,
			"sort": 0,
			"uci": "f8c5",
			"fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
		},
		{
			"id": "0fdaa8fc-e5c2-c89d-406c-44db3614292d",
			"move": "b4",
			"parentId": "a2528d48-48e5-2aae-6bde-ec05f76909cc",
			"moveNumber": 40,
			"sort": 0,
			"uci": "b2b4",
			"fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4"
		},
		{
			"id": "3abc32aa-4052-521a-dfc5-6033e8b480bd",
			"moveNumber": 15,
			"move": "c5",
			"fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "c7c5",
			"parentId": "70fb9959-af48-46dc-625d-15d14e5ea3a8",
			"sort": 2
		},
		{
			"id": "6b4af587-b8cc-c04d-c78b-eae987735677",
			"moveNumber": 20,
			"move": "Nf3",
			"fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
			"uci": "g1f3",
			"parentId": "3abc32aa-4052-521a-dfc5-6033e8b480bd",
			"sort": 3
		},
		{
			"id": "2054e718-4d3a-c347-fc9b-fae9c33a0fc9",
			"moveNumber": 25,
			"move": "d6",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
			"uci": "d7d6",
			"parentId": "6b4af587-b8cc-c04d-c78b-eae987735677",
			"sort": 4
		},
		{
			"id": "16f3223a-4a6d-057d-5670-584b93e1bf80",
			"moveNumber": 30,
			"move": "d4",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
			"uci": "d2d4",
			"parentId": "2054e718-4d3a-c347-fc9b-fae9c33a0fc9",
			"sort": 5
		},
		{
			"id": "115b6cee-7572-1ef6-dd86-c98dfc796aaf",
			"moveNumber": 35,
			"move": "cxd4",
			"fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
			"uci": "c5d4",
			"parentId": "16f3223a-4a6d-057d-5670-584b93e1bf80",
			"sort": 6
		},
		{
			"id": "6cf74784-6a99-48ff-ca16-d1c7697e98b8",
			"moveNumber": 40,
			"move": "Nxd4",
			"fen": "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
			"uci": "f3d4",
			"parentId": "115b6cee-7572-1ef6-dd86-c98dfc796aaf",
			"sort": 7
		},
		{
			"id": "027b304f-4119-d04d-7b89-c2f6ab5bc7eb",
			"moveNumber": 15,
			"move": "e6",
			"fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "e7e6",
			"parentId": "70fb9959-af48-46dc-625d-15d14e5ea3a8",
			"sort": 8
		},
		{
			"id": "0da7319f-ea1c-1703-f249-f445d67d21ea",
			"moveNumber": 20,
			"move": "d4",
			"fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
			"uci": "d2d4",
			"parentId": "027b304f-4119-d04d-7b89-c2f6ab5bc7eb",
			"sort": 9
		},
		{
			"id": "d718ae34-069f-c21c-1607-3f42957e1e94",
			"moveNumber": 25,
			"move": "d5",
			"fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
			"uci": "d7d5",
			"parentId": "0da7319f-ea1c-1703-f249-f445d67d21ea",
			"sort": 10
		},
		{
			"id": "1e211a73-d12a-cb30-a326-6d85d6fb499e",
			"moveNumber": 30,
			"move": "Nc3",
			"fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
			"uci": "b1c3",
			"parentId": "d718ae34-069f-c21c-1607-3f42957e1e94",
			"sort": 11
		},
		{
			"id": "8ec1321d-e2a9-0911-6abc-4d8da98df33c",
			"moveNumber": 35,
			"move": "Nf6",
			"fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4",
			"uci": "g8f6",
			"parentId": "1e211a73-d12a-cb30-a326-6d85d6fb499e",
			"sort": 12
		},
		{
			"id": "ee05f46c-54b5-91db-72c2-65a6713d6e55",
			"moveNumber": 25,
			"move": "Nc6",
			"fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
			"uci": "b8c6",
			"parentId": "054997ca-0016-6203-ad62-2421cb75165c",
			"sort": 13
		},
		{
			"id": "3ad1dae5-873e-5ec1-0f7a-c575c67ba497",
			"moveNumber": 30,
			"move": "Bb5",
			"fen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
			"uci": "f1b5",
			"parentId": "ee05f46c-54b5-91db-72c2-65a6713d6e55",
			"sort": 14
		},
		{
			"id": "10e2d29f-61d6-3a24-dd91-2e2bf8d3733d",
			"moveNumber": 35,
			"move": "Nf6",
			"fen": "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
			"uci": "g8f6",
			"parentId": "3ad1dae5-873e-5ec1-0f7a-c575c67ba497",
			"sort": 15
		},
		{
			"id": "6b0c9641-aa24-1e01-dddc-14185967ad47",
			"moveNumber": 40,
			"move": "d3",
			"fen": "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
			"uci": "d2d3",
			"parentId": "10e2d29f-61d6-3a24-dd91-2e2bf8d3733d",
			"sort": 16
		},
		{
			"id": "65db3366-37ed-eccf-cd1c-6f144d72e166",
			"moveNumber": 15,
			"move": "c6",
			"fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "c7c6",
			"parentId": "70fb9959-af48-46dc-625d-15d14e5ea3a8",
			"sort": 17
		},
		{
			"id": "35f8a5fa-3205-435d-accb-b6b2d2d156ea",
			"moveNumber": 20,
			"move": "d4",
			"fen": "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
			"uci": "d2d4",
			"parentId": "65db3366-37ed-eccf-cd1c-6f144d72e166",
			"sort": 18
		},
		{
			"id": "5782150b-b8d9-7bce-73ab-c7e74ae21720",
			"moveNumber": 25,
			"move": "d5",
			"fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
			"uci": "d7d5",
			"parentId": "35f8a5fa-3205-435d-accb-b6b2d2d156ea",
			"sort": 19
		},
		{
			"id": "1d69c910-0bde-18f6-b950-369d215014f5",
			"moveNumber": 30,
			"move": "e5",
			"fen": "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
			"uci": "e4e5",
			"parentId": "5782150b-b8d9-7bce-73ab-c7e74ae21720",
			"sort": 20
		},
		{
			"id": "0139fb81-ffac-8413-93bc-e793f971d915",
			"moveNumber": 35,
			"move": "Bf5",
			"fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4",
			"uci": "c8f5",
			"parentId": "1d69c910-0bde-18f6-b950-369d215014f5",
			"sort": 21
		},
		{
			"id": "911e6c00-5871-aa09-2ff5-701436fa6fed",
			"moveNumber": 40,
			"move": "h4",
			"fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P3P/8/PPP2PP1/RNBQKBNR b KQkq - 0 4",
			"uci": "h2h4",
			"parentId": "0139fb81-ffac-8413-93bc-e793f971d915",
			"sort": 22
		},
		{
			"id": "cad75b95-4c07-79a6-fdd7-91dd01e7084f",
			"moveNumber": 30,
			"move": "Bc4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
			"uci": "f1c4",
			"parentId": "ee05f46c-54b5-91db-72c2-65a6713d6e55",
			"sort": 23
		},
		{
			"id": "b2ead13c-253f-d5b8-6318-8f70cd2cec28",
			"moveNumber": 35,
			"move": "Bc5",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
			"uci": "f8c5",
			"parentId": "cad75b95-4c07-79a6-fdd7-91dd01e7084f",
			"sort": 24
		},
		{
			"id": "a0b2db58-f46b-6a57-8efb-2cdeefb5088f",
			"moveNumber": 40,
			"move": "c3",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4",
			"uci": "c2c3",
			"parentId": "b2ead13c-253f-d5b8-6318-8f70cd2cec28",
			"sort": 25
		},
		{
			"id": "2ad8a413-44a3-03f5-2954-86599dd166f7",
			"moveNumber": 20,
			"move": "Nc3",
			"fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
			"uci": "b1c3",
			"parentId": "3abc32aa-4052-521a-dfc5-6033e8b480bd",
			"sort": 26
		},
		{
			"id": "b84f2e41-8122-6255-fd3c-8695d4967554",
			"moveNumber": 25,
			"move": "d6",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
			"uci": "d7d6",
			"parentId": "2ad8a413-44a3-03f5-2954-86599dd166f7",
			"sort": 27
		},
		{
			"id": "66c4cc32-d630-234f-55b5-f2a7173bf098",
			"moveNumber": 30,
			"move": "g3",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR b KQkq - 0 3",
			"uci": "g2g3",
			"parentId": "b84f2e41-8122-6255-fd3c-8695d4967554",
			"sort": 28
		},
		{
			"id": "6ddde45e-47f7-aa87-3406-c49b4e2da214",
			"moveNumber": 35,
			"move": "Nc6",
			"fen": "r1bqkbnr/pp2pppp/2np4/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR w KQkq - 1 4",
			"uci": "b8c6",
			"parentId": "66c4cc32-d630-234f-55b5-f2a7173bf098",
			"sort": 29
		},
		{
			"id": "e88aa73f-f9d4-da18-c1e1-b57c2020d36f",
			"moveNumber": 40,
			"move": "Bg2",
			"fen": "r1bqkbnr/pp2pppp/2np4/2p5/4P3/2N3P1/PPPP1PBP/R1BQK1NR b KQkq - 2 4",
			"uci": "f1g2",
			"parentId": "6ddde45e-47f7-aa87-3406-c49b4e2da214",
			"sort": 30
		},
		{
			"id": "d2d9fba4-0cda-9534-e51b-fd02dbc86a76",
			"moveNumber": 30,
			"move": "d4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
			"uci": "d2d4",
			"parentId": "ee05f46c-54b5-91db-72c2-65a6713d6e55",
			"sort": 31
		},
		{
			"id": "ed5be328-46c9-fb0f-9103-8d034dc55119",
			"moveNumber": 35,
			"move": "exd4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
			"uci": "e5d4",
			"parentId": "d2d9fba4-0cda-9534-e51b-fd02dbc86a76",
			"sort": 32
		},
		{
			"id": "5dbe147c-3c2f-4445-6b44-d294d25ec634",
			"moveNumber": 40,
			"move": "Nxd4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
			"uci": "f3d4",
			"parentId": "ed5be328-46c9-fb0f-9103-8d034dc55119",
			"sort": 33
		},
		{
			"id": "2cd144e7-b56a-04b1-9042-6e554a141a65",
			"moveNumber": 45,
			"move": "Bc5",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
			"uci": "f8c5",
			"parentId": "5dbe147c-3c2f-4445-6b44-d294d25ec634",
			"sort": 34
		},
		{
			"id": "80cfcaa2-a246-161f-a712-26b0fda0fde6",
			"moveNumber": 50,
			"move": "Nb3",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b5/4P3/1N6/PPP2PPP/RNBQKB1R b KQkq - 2 5",
			"uci": "d4b3",
			"parentId": "2cd144e7-b56a-04b1-9042-6e554a141a65",
			"sort": 35
		},
		{
			"id": "625c376c-ac6b-385e-39aa-f8b18a13c367",
			"moveNumber": 15,
			"move": "d6",
			"fen": "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "d7d6",
			"parentId": "70fb9959-af48-46dc-625d-15d14e5ea3a8",
			"sort": 36
		},
		{
			"id": "64c0539a-de7f-6da7-06a7-a364d85fb27d",
			"moveNumber": 20,
			"move": "d4",
			"fen": "rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
			"uci": "d2d4",
			"parentId": "625c376c-ac6b-385e-39aa-f8b18a13c367",
			"sort": 37
		},
		{
			"id": "68f49077-3082-ca72-0205-e055eed117bf",
			"moveNumber": 25,
			"move": "Nf6",
			"fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3",
			"uci": "g8f6",
			"parentId": "64c0539a-de7f-6da7-06a7-a364d85fb27d",
			"sort": 38
		},
		{
			"id": "a470ac74-aaac-4f3d-35e9-ef14f205982b",
			"moveNumber": 30,
			"move": "Nc3",
			"fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
			"uci": "b1c3",
			"parentId": "68f49077-3082-ca72-0205-e055eed117bf",
			"sort": 39
		}
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

	const setTransposition = function(current_uuid: RepertoireMoveModel["id"], prev_uuid: RepertoireMoveModel["id"]) {
		for (let i = 0; i < REPERTOIRE.moves!.length; i++) {
			const move = REPERTOIRE.moves![i];

			if (move.id === prev_uuid) {
				console.log("Gh11");
				REPERTOIRE.moves![i].transpositionId = current_uuid;
				
				return setRepertoire({...REPERTOIRE});
			}
		}
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
					onTransposition={setTransposition}
					arrows={arrows}
				/>
			}
		</ApolloConsumer>
	);
}

export default RepertoireDemo;