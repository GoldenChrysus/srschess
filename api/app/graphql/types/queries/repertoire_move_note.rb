module Types
	module Queries
		class RepertoireMoveNote < Types::BaseQuery
			# /repertoire_move_note
			type Types::Models::RepertoireMoveNoteType, null: true
			argument :move_id, ID, required: true
	
			def resolve(move_id:)
				move = ::RepertoireMove.find(move_id)

				authorize move, :show?
				move.note
			end
		end
	end
end