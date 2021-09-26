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
				uci
				moveNumber
				move
				sort
				parentId
				transpositionId
			}
		}
	}
`;

export const GET_MOVE = gql`
	fragment MyMove on Move {
		id
		parentId
		transpositionId
		move
		sort
		moveNumber
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
	mutation CreateMove($id: String!, $repertoireId: ID!, $fen: String!, $uci: String!, $moveNumber: Int!, $move: String!, $parentId: ID) {
		createMove(input: {
			id: $id,
			repertoireId: $repertoireId,
			fen: $fen,
			uci: $uci,
			moveNumber: $moveNumber,
			move: $move,
			parentId: $parentId
		}) {
			move {
				id
			}
			errors
		}
	}
`;

export const TRANSPOSE_MOVE = gql`
	mutation TransposeMove($id: String!, $transpositionId: String!) {
		transposeMove(input: {
			id: $id,
			transpositionId: $transpositionId
		}) {
			move {
				id
				transpositionId
			}
			errors
		}
	}
`;