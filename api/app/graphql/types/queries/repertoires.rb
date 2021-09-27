module Types
	module Queries
		class Repertoires < Types::BaseQuery
			# /repertoires
			type [Types::Models::RepertoireType], null: false
			
			def resolve
				::User.find(context[:user].id).repertoires
			end
		end
	end
end