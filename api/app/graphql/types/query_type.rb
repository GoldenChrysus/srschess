module Types
	class QueryType < Types::BaseObject
		# Add `node(id: ID!) and `nodes(ids: [ID!]!)`
		include GraphQL::Types::Relay::HasNodeField
		include GraphQL::Types::Relay::HasNodesField

		# /users
		field :users, Types::Models::UserType, null: false do
			argument :user_id, ID, required: true
		end

		def users(user_id:)
			User.find(user_id)
		end

		# /repertoires
		field :repertoires, [Types::Models::RepertoireType], null: false do
			argument :user_id, ID, required: true
		end

		def repertoires(user_id:)
			User.find(user_id).repertoires
		end

		# /moves
		field :moves, [Types::Models::MoveType], null: false do
			argument :repertoire_id, ID, required: true
		end

		def moves(repertoire_id:)
			Repertoire.find(repertoire_id).moves
		end
	end
end
