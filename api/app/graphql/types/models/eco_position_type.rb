module Types
	module Models
		class EcoPositionType < Types::BaseObject
			field :id, ID, null: false
			field :slug, String, null: false
			field :code, String, null: false
			field :name, String, null: false
			field :fen, String, null: false
			field :pgn, String, null: false
			field :movelist, String, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
		end
	end
end
