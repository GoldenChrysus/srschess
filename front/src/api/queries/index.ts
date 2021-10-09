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
			nextReview
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

export const GET_REPERTOIRE_QUEUES = gql`
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			id
			slug
			name
			side
			nextReview
			reviewQueueLength
			reviewQueue {
				id
				parentId
				move
				uci
				movelist
				similarMoves
			}
			lessonQueueLength
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

export const GET_REPERTOIRE_MOVES = gql`
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
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

export const GET_REPERTOIRE_CACHED = gql`
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			id
			slug
			name
			side
			lessonQueueLength
			reviewQueueLength
			nextReview
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
			nextReview
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

export const GET_MOVE_FRAG = gql`
	fragment MyMove on Move {
		id
		parentId
		transpositionId
		move
		sort
		moveNumber
	}
`;

export const GET_REPERTOIRE_FRAG = gql`
	fragment MyRepertoire on Repertoire {
		id
		slug
		name
		side
		nextReview
		lessonQueueLength
		reviewQueueLength
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



/**
 * MASTER GAME DATA
 */
export const GET_MASTER_MOVE = gql`
	query MasterMoves($move: String, $moveNumber: Int!) {
		masterMoves(move: $move, moveNumber: $moveNumber) {
			key
			move
			white
			draw
			black
			elo
		}
	}
`;