module Types
	module Models
		class CollectionType < Types::BaseObject
			field :id, ID, null: false
			field :name, String, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :user, Types::Models::UserType, null: false
			field :games, [Types::Models::GameType], null: true
		end
	end
end
