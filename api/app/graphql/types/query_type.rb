module Types
	class QueryType < Types::BaseObject
		# Add `node(id: ID!) and `nodes(ids: [ID!]!)`
		include GraphQL::Types::Relay::HasNodeField
		include GraphQL::Types::Relay::HasNodesField

		# /auth
		field :auth, resolver: Types::Queries::Auth

		# /user
		field :user, resolver: Types::Queries::User

		# /repertoires
		field :repertoires, resolver: Types::Queries::Repertoires

		# /repertoire
		field :repertoire, resolver: Types::Queries::Repertoire

		# /repertoire_moves
		field :repertoire_moves, resolver: Types::Queries::RepertoireMoves

		# /repertoire_move
		field :repertoire_move, resolver: Types::Queries::RepertoireMove

		# /master_moves
		field :master_moves, resolver: Types::Queries::MasterMoves
	end
end
