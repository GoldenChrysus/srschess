module Types
	module Models
		class RepertoireType < Types::BaseObject
			field :id, ID, null: false
			field :name, String, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
			field :side, String, null: false

			# Relationships
			field :user, Types::Models::UserType, null: true
			field :moves, [Types::Models::MoveType], null: true
		end
	end
end
