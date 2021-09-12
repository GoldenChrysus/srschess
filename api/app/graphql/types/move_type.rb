module Types
	class MoveType < Types::BaseObject
		field :id, String, null: false
		field :move_number, Integer, null: false
		field :move, String, null: false
		field :fen, String, null: false
		field :sort, Integer, null: false
		field :created_at, GraphQL::Types::ISO8601DateTime, null: false
		field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

		# Relationships
		field :repertoire, Types::RepertoireType, null: false
		field :parent, Types::MoveType, null: true
		field :moves, [Types::MoveType], null: true
	end
end
