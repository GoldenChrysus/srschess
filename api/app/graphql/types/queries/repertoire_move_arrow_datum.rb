module Types
	module Queries
		class RepertoireMoveArrowDatum < Types::BaseQuery
			# /repertoire_move_arrow_datum
			type Types::Models::RepertoireMoveArrowDatumType, null: true
			argument :move_id, ID, required: true

			def resolve(move_id:)
				begin
					move = ::RepertoireMove.find(move_id)
				rescue
					return nil
				end

				authorize move, :show?
				move.arrow
			end
		end
	end
end
