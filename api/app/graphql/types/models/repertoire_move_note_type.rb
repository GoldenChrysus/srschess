module Types
	module Models
		class RepertoireMoveNoteType < Types::BaseObject
			field :id, ID, null: false
			field :move_id, String, null: false
			field :value, String, null: true
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :move, Types::Models::RepertoireMoveType, null: false
		end
	end
end
