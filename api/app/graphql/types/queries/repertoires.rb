module Types
	module Queries
		class Repertoires < Types::BaseQuery
			# /repertoires
			type [Types::Models::RepertoireType], null: false
			argument :user_id, ID, required: true
			
			def resolve(user_id:)
				::User.find(user_id).repertoires
			end
		end
	end
end