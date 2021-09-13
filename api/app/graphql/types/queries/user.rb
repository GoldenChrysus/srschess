module Types
	module Queries
		class User < Types::BaseQuery
			# /user
			type Types::Models::UserType, null: false
			argument :user_id, ID, required: true

			def resolve(user_id:)
				::User.find(user_id)
			end
		end
	end
end