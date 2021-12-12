module Types
	class QueryType < Types::BaseObject
		# Add `node(id: ID!) and `nodes(ids: [ID!]!)`
		include GraphQL::Types::Relay::HasNodeField
		include GraphQL::Types::Relay::HasNodesField

		# /auth
		field :auth, resolver: Types::Queries::Auth

		# /user
		field :user, resolver: Types::Queries::User

		# /collections
		field :collections, resolver: Types::Queries::Collections

		# /collection
		field :collection, resolver: Types::Queries::Collection

		# /repertoires
		field :repertoires, resolver: Types::Queries::Repertoires

		# /repertoire
		field :repertoire, resolver: Types::Queries::Repertoire

		# /repertoire_moves
		field :repertoire_moves, resolver: Types::Queries::RepertoireMoves

		# /repertoire_move
		field :repertoire_move, resolver: Types::Queries::RepertoireMove

		# /repertoire_move_note
		field :repertoire_move_note, resolver: Types::Queries::RepertoireMoveNote

		# /master_moves
		field :master_moves, resolver: Types::Queries::MasterMoves

		# /fen_eco
		field :fen_eco, resolver: Types::Queries::FenEco

		# /eco_positions
		field :eco_positions, resolver: Types::Queries::EcoPositions

		# /chess_search
		field :chess_search, resolver: Types::Queries::ChessSearch
	end
end
