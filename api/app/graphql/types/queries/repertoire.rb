module Types
	module Queries
		class Repertoire < Types::BaseQuery
			# /repertoire
			type Types::Models::RepertoireType, null: false
			argument :id, ID, required: true
			
			def resolve(id:)
				::Repertoire.find(id)
			end
		end
	end
end