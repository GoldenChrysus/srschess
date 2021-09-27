module Types
	module Queries
		class Repertoire < Types::BaseQuery
			# /repertoire
			type Types::Models::RepertoireType, null: false
			argument :id, ID, required: true
			
			def resolve(id:)
				repertoire = ::Repertoire.find(id)

				authorize repertoire, :show?
				repertoire
			end
		end
	end
end