import { gql } from "@apollo/client";

export const CREATE_USER = gql`
	mutation CreateUser($email: String!, $uid: String!) {
		createUser(input: {
			email: $email,
			uid: $uid
		}) {
			user {
				id
			}
			errors
		}
	}
`;

export const CREATE_REPERTOIRE = gql`
	mutation CreateRepertoire($name: String!, $side: String!) {
		createRepertoire(input: {
			name: $name,
			side: $side
		}) {
			repertoire {
				id
				slug
			}
			errors
		}
	}
`;

export const GET_REPERTOIRE = gql`
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			id
			slug
			name
			side
			lessonQueueLength
			reviewQueueLength
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

export const GET_REPERTOIRE_LESSONS = gql`
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			id
			slug
			name
			side
			lessonQueue {
				id
				parentId
				move
				uci
				movelist
			}
		}
	}
`;

export const GET_REPERTOIRE_REVIEWS = gql`
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			id
			slug
			name
			side
			reviewQueue {
				id
				parentId
				move
				uci
				movelist
				similarMoves
			}
		}
	}
`;

export const GET_REPERTOIRES = gql`
	query Repertoires {
		repertoires {
			id
			slug
			name
			side
			lessonQueueLength
			reviewQueueLength
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

export const CREATE_REVIEW = gql`
	mutation CreateReview($moveId: String!, $incorrectAttempts: Int!, $attempts: Int!, $averageCorrectTime: Float!, $averageTime: Float!) {
		createReview(input: {
			moveId: $moveId,
			incorrectAttempts: $incorrectAttempts,
			attempts: $attempts,
			averageCorrectTime: $averageCorrectTime,
			averageTime: $averageTime,
		}) {
			learnedItem {
				id
			}
			errors
		}
	}
`;