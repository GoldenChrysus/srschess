module Types
	module Models
		class GameMoveType < Types::BaseObject
			field :id, ID, null: false
			field :ply, Integer, null: false
			field :move, String, null: false
			field :fen, String, null: false
			field :uci, String, null: true
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :game, Types::Models::GameType, null: false
			field :note, Types::Models::GameMoveNoteType, null: true
		end
	end
end
