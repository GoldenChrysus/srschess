module Types
	module Queries
		class EcoPosition < Types::BaseQuery
			# /eco_position
			type Types::Models::EcoPositionType, null: false
			argument :slug, String, required: true
			
			def resolve(slug:)
				::EcoPosition.where({slug: slug}).first
			end
		end
	end
end