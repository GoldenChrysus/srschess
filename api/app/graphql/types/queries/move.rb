module Types
	module Queries
		class Move < Types::BaseQuery
			# /move
			type Types::Models::MoveType, null: false
			argument :id, ID, required: true
	
			def resolve(id:)
				move = ::Move.find(id)

				authorize move, :show?
				move
			end
		end
	end
end