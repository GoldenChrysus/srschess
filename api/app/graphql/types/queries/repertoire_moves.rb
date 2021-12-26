module Types
	module Queries
		class RepertoireMoves < Types::BaseQuery
			# /repertoire_moves
			type [Types::Models::RepertoireMoveType], null: false
			argument :repertoire_id, ID, required: true
	
			def resolve(repertoire_id:)
				begin
					repertoire = ::Repertoire.find(repertoire_id)
				rescue
					return nil
				end

				authorize repertoire, :show?
				repertoire.moves
			end
		end
	end
end