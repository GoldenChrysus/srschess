module Types
	module Queries
		class EcoPositions < Types::BaseQuery
			# /eco_positions
			type [Types::Models::EcoPositionType], null: false
			
			def resolve()
				::EcoPosition.order("code ASC, name ASC").all
			end
		end
	end
end