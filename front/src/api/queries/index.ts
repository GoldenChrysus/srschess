import { gql } from "@apollo/client";

export const GET_REPERTOIRE = gql`
	query Repertoire($id: ID!) {
		repertoire(id: $id) {
			id
			name
			side
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