module Types
	class QueryType < Types::BaseObject
		# Add `node(id: ID!) and `nodes(ids: [ID!]!)`
		include GraphQL::Types::Relay::HasNodeField
		include GraphQL::Types::Relay::HasNodesField

		# /auth
		field :auth, resolver: Types::Queries::Auth

		# /user
		field :user, resolver: Types::Queries::User

		# /user_settings
		field :user_settings, resolver: Types::Queries::UserSettings

		# /communication_enrollments
		field :communication_enrollments, resolver: Types::Queries::CommunicationEnrollments

		# /collections
		field :collections, resolver: Types::Queries::Collections

		# /collection
		field :collection, resolver: Types::Queries::Collection

		# /game
		field :game, resolver: Types::Queries::Game

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

		# /master_game
		field :master_game, resolver: Types::Queries::MasterGame

		# /fen_eco
		field :fen_eco, resolver: Types::Queries::FenEco

		# /eco_positions
		field :eco_positions, resolver: Types::Queries::EcoPositions

		# /eco_position
		field :eco_position, resolver: Types::Queries::EcoPosition

		# /chess_search
		field :chess_search, resolver: Types::Queries::ChessSearch
	end
end
