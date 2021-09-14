import { gql } from "@apollo/client";

export const GET_REPERTOIRE = gql`
	query Repertoire($id: ID!) {
		repertoire(id: $id) {
			id
			name
			side
			moves {
				id
				fen
				moveNumber
				move
				sort
				moves {
					moveNumber
					sort
				}
			}
		}
	}
`;

export const GET_REPERTOIRES = gql`
	query Repertoires($userId: ID!) {
		repertoires(userId: $userId) {
			id
			name
			side
		}
	}
`;

export const CREATE_MOVE = gql`
	mutation CreateMove($id: String!, $repertoireId: ID!, $fen: String! $moveNumber: Int!, $move: String!, $sort: Int!, $parentId: ID) {
		createMove(input: {
			id: $id,
			repertoireId:
			$repertoireId,
			fen: $fen,
			moveNumber: $moveNumber,
			move: $move,
			sort: $sort,
			parentId: $parentId
		}) {
			move {
				id
			}
			errors
		}
	}
`;