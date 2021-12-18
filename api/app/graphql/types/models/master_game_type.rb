module Types
	module Models
		class MasterGameType < Types::BaseObject
			field :id, String, null: false
			field :pgn, String, null: false
			field :movelist, String, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
		end
	end
end
