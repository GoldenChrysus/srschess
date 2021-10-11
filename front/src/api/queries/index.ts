import { gql } from "@apollo/client";

const REPERTOIRE_FRAG = gql`
	fragment CoreRepertoireFields on Repertoire {
		id
		slug
		name
		side
		nextReview
		lessonQueueLength
		reviewQueueLength
	}
`;

export const MOVE_FRAG = gql`
	fragment CoreMoveFields on Move {
		id
		fen
		uci
		moveNumber
		move
		sort
		parentId
		transpositionId
	}
`;

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
	${REPERTOIRE_FRAG}
	${MOVE_FRAG}
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			...CoreRepertoireFields
			moves {
				...CoreMoveFields
			}
		}
	}
`;

export const GET_REPERTOIRE_QUEUES = gql`
	${REPERTOIRE_FRAG}
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			...CoreRepertoireFields
			reviewQueue {
				id
				parentId
				move
				uci
				movelist
				similarMoves
			}
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
	${MOVE_FRAG}
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			moves {
				...CoreMoveFields
			}
		}
	}
`;

export const GET_REPERTOIRE_CACHED = gql`
	${REPERTOIRE_FRAG}
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			...CoreRepertoireFields
		}
	}
`;

export const GET_REPERTOIRES = gql`
	${REPERTOIRE_FRAG}
	query Repertoires {
		repertoires {
			...CoreRepertoireFields
		}
	}
`;

export const CREATE_MOVE = gql`
	${REPERTOIRE_FRAG}
	${MOVE_FRAG}
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
				repertoire {
					...CoreRepertoireFields
					moves {
						...CoreMoveFields
					}
				}
			}
			errors
		}
	}
`;

export const TRANSPOSE_MOVE = gql`
	${REPERTOIRE_FRAG}
	${MOVE_FRAG}
	mutation TransposeMove($id: String!, $transpositionId: String!) {
		transposeMove(input: {
			id: $id,
			transpositionId: $transpositionId
		}) {
			move {
				id
				transpositionId
				repertoire {
					...CoreRepertoireFields
					moves {
						...CoreMoveFields
					}
				}
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
	query MasterMoves($fen: String) {
		masterMoves(fen: $fen) {
			key
			move
			white
			draw
			black
			elo
		}
	}
`;