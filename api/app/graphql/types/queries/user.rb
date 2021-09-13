module Types
	module Queries
		class User < Types::BaseQuery
			# /user
			type Types::Models::UserType, null: false
			argument :id, ID, required: true

			def resolve(id:)
				::User.find(id)
			end
		end
	end
end