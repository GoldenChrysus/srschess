module Types
	module Queries
		class Game < Types::BaseQuery
			# /game
			type Types::Models::GameType, null: false
			argument :id, ID, required: true
			
			def resolve(id:)
				game = ::Game.find(id)

				authorize game, :show?
				game
			end
		end
	end
end