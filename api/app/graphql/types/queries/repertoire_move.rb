module Types
	module Queries
		class RepertoireMove < Types::BaseQuery
			# /repertoire_move
			type Types::Models::RepertoireMoveType, null: false
			argument :id, ID, required: true
	
			def resolve(id:)
				move = ::RepertoireMove.find(id)

				authorize move, :show?
				move
			end
		end
	end
end