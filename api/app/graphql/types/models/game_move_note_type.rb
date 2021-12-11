module Types
	module Models
		class GameMoveNoteType < Types::BaseObject
			field :id, ID, null: false
			field :value, String, null: true
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :move, Types::Models::GameMoveType, null: false
		end
	end
end
