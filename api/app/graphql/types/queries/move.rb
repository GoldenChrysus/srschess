module Types
	module Queries
		class Move < Types::BaseQuery
			# /move
			type Types::Models::MoveType, null: false
			argument :id, ID, required: true
	
			def resolve(id:)
				::Move.find(id)
			end
		end
	end
end