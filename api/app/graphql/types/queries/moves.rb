module Types
	module Queries
		class Moves < Types::BaseQuery
			# /moves
			type [Types::Models::MoveType], null: false
			argument :repertoire_id, ID, required: true
	
			def resolve(repertoire_id:)
				Repertoire.find(repertoire_id).moves
			end
		end
	end
end