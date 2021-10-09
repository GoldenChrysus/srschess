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

		# /moves
		field :moves, resolver: Types::Queries::Moves

		# /move
		field :move, resolver: Types::Queries::Move

		# /master_moves
		field :master_moves, resolver: Types::Queries::MasterMoves
	end
end
