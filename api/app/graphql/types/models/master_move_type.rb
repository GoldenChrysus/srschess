module Types
	module Models
		class MasterMoveType < Types::BaseObject
			field :key, Integer, null: false
			field :move, String, null: false
			field :white, Integer, null: false
			field :draw, Integer, null: false
			field :black, Integer, null: false
			field :elo, Integer, null: false
		end
	end
end
