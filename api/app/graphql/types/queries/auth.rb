module Types
	module Queries
		class Auth < Types::BaseQuery
			# /auth
			type Types::Models::UserType, null: false
			argument :email, String, required: true
			argument :password, String, required: true

			def resolve(email:, password:)
				::User.login(email, password)
			end
		end
	end
end