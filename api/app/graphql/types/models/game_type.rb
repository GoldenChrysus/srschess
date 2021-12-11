module Types
	module Models
		class GameType < Types::BaseObject
			field :id, ID, null: false
			field :date, GraphQL::Types::ISO8601DateTime, null: false
			field :pgn, String, null: false
			field :movelist, String, null: false
			field :source, String, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :user, Types::Models::UserType, null: false
			field :collection, Types::Models::CollectionType, null: false
			field :moves, [Types::Models::GameMoveType], null: true
		end
	end
end
