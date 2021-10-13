module Types
	module Models
		class LearnedItemType < Types::BaseObject
			field :id, ID, null: false
			field :move_id, String, null: false
			field :level, Integer, null: false
			field :next_review, GraphQL::Types::ISO8601DateTime, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :move, Types::Models::RepertoireMoveType, null: false
		end
	end
end
