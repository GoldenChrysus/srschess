module Types
	module Models
		class GameType < Types::BaseObject
			field :id, ID, null: false
			field :date, String, null: true
			field :white, String, null: true
			field :black, String, null: true
			field :result, String, null: true
			field :name, String, null: false
			field :pgn, String, null: false
			field :movelist, String, null: false
			field :source, String, null: false
			field :event, String, null: true
			field :round, String, null: true
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :user, Types::Models::UserType, null: false
			field :collection, Types::Models::CollectionType, null: false
			field :moves, [Types::Models::GameMoveType], null: true
		end
	end
end
