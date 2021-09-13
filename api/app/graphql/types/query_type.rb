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

		# /moves
		field :moves, resolver: Types::Queries::Moves
	end
end
