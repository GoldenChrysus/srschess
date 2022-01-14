module Types
	module Models
		class RepertoireMoveArrowDatumType < Types::BaseObject
			field :id, ID, null: false
			field :repertoire_move_id, String, null: false
			field :data, [String], null: true
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :move, Types::Models::RepertoireMoveType, null: false
		end
	end
end
