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

const COLLECTION_FRAG = gql`
	fragment CoreCollectionFields on Collection {
		id
		slug
		name
		gameCount
	}
`;

const GAME_FRAG = gql`
	fragment CoreGameFields on Game {
		id
		white
		black
		result
		name
		date
		event
		round
	}
`;

export const CREATE_USER = gql`
	mutation CreateUser($email: String!, $uid: String!, $type: String!) {
		createUser(input: {
			email: $email,
			uid: $uid,
			type: $type
		}) {
			user {
				id
			}
			errors
		}
	}
`;

export const CREATE_COMMUNICATION_ENROLLMENT = gql`
	mutation CreateCommunicationEnrollment($name: String!) {
		createCommunicationEnrollment(input: {
			name: $name
		}) {
			enrollment {
				id
				name
			}
			errors
		}
	}
`;

export const GET_COMMUNICATION_ENROLLMENTS = gql`
	query CommunicationEnrollments {
		communicationEnrollments {
			name
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

export const CLONE_REPERTOIRE = gql`
	mutation CloneRepertoire($id: ID!) {
		cloneRepertoire(input: {
			id: $id
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
		repertoire(slug: $slug, mode: "repertoire") {
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
		repertoire(slug: $slug, mode: "review") {
			...CoreRepertoireFields
			userOwned
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
		repertoire(slug: $slug, mode: "repertoire") {
			moves {
				...CoreMoveFields
			}
		}
	}
`;

export const GET_REPERTOIRE_CACHED = gql`
	${REPERTOIRE_FRAG}
	query Repertoire($slug: String!) {
		repertoire(slug: $slug, mode: "repertoire") {
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

export const REORDER_REPERTOIRE_MOVE = gql`
	${REPERTOIRE_FRAG}
	${REPERTOIRE_MOVE_FRAG}
	mutation ReorderRepertoireMove($id: String!, $direction: String!) {
		reorderRepertoireMove(input: {
			id: $id,
			direction: $direction
		}) {
			move {
				id
				sort
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
	${REPERTOIRE_FRAG}
	${REPERTOIRE_MOVE_FRAG}
	mutation DeleteRepertoireMove($id: String!) {
		deleteRepertoireMove(input: {
			id: $id
		}) {
			repertoire {
				...CoreRepertoireFields
				moves {
					...CoreMoveFields
				}
				userOwned
			}
			previousMoves {
				id
				transpositionId
				sort
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

export const IMPORT_ECO_TO_REPERTOIRE = gql`
	${REPERTOIRE_MOVE_FRAG}
	mutation ImportEcoToRepertoire($repertoireId: ID!, $ecoId: ID!, $side: String) {
		importEcoToRepertoire(input: {
			repertoireId: $repertoireId,
			ecoId: $ecoId,
			side: $side
		}) {
			repertoire {
				id
				slug
				moves {
					...CoreMoveFields
				}
			}
			errors
		}
	}
`;

/**
 * COLLECTION DATA
 */
 export const GET_COLLECTIONS = gql`
	${COLLECTION_FRAG}
	query Collections {
		collections {
			...CoreCollectionFields
		}
	}
`;

export const GET_COLLECTION = gql`
	${COLLECTION_FRAG}
	${GAME_FRAG}
	query Collection($slug: String!) {
		collection(slug: $slug) {
			...CoreCollectionFields
			games {
				...CoreGameFields
			}
		}
	}
`;

export const GET_GAME = gql`
	${GAME_FRAG}
	query Game($id: ID!) {
		game(id: $id) {
			...CoreGameFields
			pgn
		}
	}
`;

export const CREATE_COLLECTION = gql`
	${COLLECTION_FRAG}
	mutation CreateCollection($name: String!) {
		createCollection(input: {
			name: $name
		}) {
			collection {
				...CoreCollectionFields
			}
			errors
		}
	}
`;

export const EDIT_COLLECTION = gql`
	mutation EditCollection($id: ID!, $name: String!) {
		editCollection(input: {
			id: $id,
			name: $name,
		}) {
			collection {
				id
				slug
				name
			}
			errors
		}
	}
`;

export const DELETE_COLLECTION = gql`
	mutation DeleteCollection($id: ID!) {
		deleteCollection(input: {
			id: $id
		}) {
			errors
		}
	}
`;

export const CREATE_COLLECTION_GAMES = gql`
	mutation CreateCollectionGames($collectionId: ID!, $pgn: String!) {
		createCollectionGames(input: {
			collectionId: $collectionId,
			pgn: $pgn
		}) {
			games {
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

export const GET_MASTER_GAME = gql`
	query MasterGame($id: String!) {
		masterGame(id: $id) {
			id
			white
			black
			pgn
			movelist
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

export const GET_ECOS = gql`
	query EcoPositions {
		ecoPositions {
			id
			slug
			fen
			pgn
			code
			name
		}
	}
`;

export const GET_ECO = gql`
	query EcoPosition($slug: String!) {
		ecoPosition(slug: $slug) {
			id
			slug
			fen
			pgn
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
			side
			result
			event
			round
		}
	}
`;