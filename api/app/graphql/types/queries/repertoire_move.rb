module Types
	module Queries
		class RepertoireMove < Types::BaseQuery
			# /repertoire_move
			type Types::Models::RepertoireMoveType, null: false
			argument :id, ID, required: true
	
			def resolve(id:)
				begin
					move = ::RepertoireMove.find(id)
				rescue
					return nil
				end

				authorize move, :show?
				move
			end
		end
	end
end