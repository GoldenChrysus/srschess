module Types
	module Queries
		class Moves < Types::BaseQuery
			# /moves
			type [Types::Models::MoveType], null: false
			argument :repertoire_id, ID, required: true
	
			def resolve(repertoire_id:)
				repertoire = ::Repertoire.find(repertoire_id)

				authorize repertoire, :show?
				repertoire.moves
			end
		end
	end
end