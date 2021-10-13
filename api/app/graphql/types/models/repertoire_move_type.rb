module Types
	module Models
		class RepertoireMoveType < Types::BaseObject
			field :id, String, null: false
			field :move_number, Integer, null: false
			field :move, String, null: false
			field :fen, String, null: false
			field :uci, String, null: false
			field :sort, Integer, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
			field :parent_id, String, null: true
			field :transposition_id, String, null: true

			# Relationships
			field :repertoire, Types::Models::RepertoireType, null: false
			field :parent, Types::Models::RepertoireMoveType, null: true
			field :moves, [Types::Models::RepertoireMoveType], null: true
			field :transposition, Types::Models::RepertoireMoveType, null: true
			field :transpositions, [Types::Models::RepertoireMoveType], null: true
		end
	end
end
