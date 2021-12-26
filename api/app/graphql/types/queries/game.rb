module Types
	module Queries
		class Game < Types::BaseQuery
			# /game
			type Types::Models::GameType, null: false
			argument :id, ID, required: true
			
			def resolve(id:)
				begin
					game = ::Game.find(id)
				rescue
					return nil
				end

				authorize game, :show?
				game
			end
		end
	end
end