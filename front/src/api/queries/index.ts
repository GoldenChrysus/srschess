import { gql } from "@apollo/client";

const REPERTOIRE_FRAG = gql`
	fragment CoreRepertoireFields on Repertoire {
		id
		slug
		name
		side
		public
		nextReview
		lessonQueueLength
		reviewQueueLength
	}
`;

export const REPERTOIRE_MOVE_FRAG = gql`
	fragment CoreMoveFields on RepertoireMove {
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
	mutation CreateRepertoire($name: String!, $side: String!, $public: Boolean!) {
		createRepertoire(input: {
			name: $name,
			side: $side,
			public: $public
		}) {
			repertoire {
				id
				slug
			}
			errors
		}
	}
`;

export const EDIT_REPERTOIRE = gql`
	mutation EditRepertoire($id: ID!, $name: String!, $public: Boolean!) {
		editRepertoire(input: {
			id: $id,
			name: $name,
			public: $public
		}) {
			repertoire {
				id
				slug
				name
				public
			}
			errors
		}
	}
`;

export const DELETE_REPERTOIRE = gql`
	mutation DeleteRepertoire($id: ID!) {
		deleteRepertoire(input: {
			id: $id
		}) {
			errors
		}
	}
`;

export const GET_REPERTOIRE = gql`
	${REPERTOIRE_FRAG}
	${REPERTOIRE_MOVE_FRAG}
	query Repertoire($slug: String!) {
		repertoire(slug: $slug) {
			...CoreRepertoireFields
			moves {
				...CoreMoveFields
			}
			userOwned
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
	${REPERTOIRE_MOVE_FRAG}
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

export const CREATE_REPERTOIRE_MOVE = gql`
	${REPERTOIRE_FRAG}
	${REPERTOIRE_MOVE_FRAG}
	mutation CreateRepertoireMove($id: String!, $repertoireId: ID!, $fen: String!, $uci: String!, $moveNumber: Int!, $move: String!, $parentId: ID) {
		createRepertoireMove(input: {
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

export const TRANSPOSE_REPERTOIRE_MOVE = gql`
	${REPERTOIRE_FRAG}
	${REPERTOIRE_MOVE_FRAG}
	mutation TransposeRepertoireMove($id: String!, $transpositionId: String!) {
		transposeRepertoireMove(input: {
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

export const DELETE_REPERTOIRE_MOVE = gql`
	mutation DeleteRepertoireMove($id: String!) {
		deleteRepertoireMove(input: {
			id: $id
		}) {
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

export const GET_REPERTOIRE_MOVE_NOTE = gql`
	query RepertoireMoveNote($moveId: ID!) {
		repertoireMoveNote(moveId: $moveId) {
			id
			repertoireMoveId
			value
		}
	}
`;

export const CREATE_REPERTOIRE_MOVE_NOTE = gql`
	mutation CreateRepertoireMoveNote($moveId: ID!, $value: String) {
		createRepertoireMoveNote(input: {
			moveId: $moveId,
			value: $value,
		}) {
			note {
				id
				repertoireMoveId
				value
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

/**
 * FEN ECO DATA
 */
export const GET_FEN_ECO = gql`
	query FenEco($fens: [String!]!) {
		fenEco(fens: $fens) {
			code
			name
		}
	}
`;

export const GET_ECO = gql`
	query EcoPositions {
		ecoPositions {
			id
			code
			name
		}
	}
`;

/**
 * REPERTOIRE/GAME SEARCH
 */
export const GET_CHESS_SEARCH = gql`
	query ChessSearch($criteria: Criteria!) {
		chessSearch(criteria: $criteria) {
			slug
			name
			createdAt
			moveCount
		}
	}
`;