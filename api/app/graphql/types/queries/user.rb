module Types
	module Queries
		class User < Types::BaseQuery
			# /user
			type Types::Models::UserType, null: false
			argument :id, ID, required: true

			def resolve(id:)
				begin
					::User.find(id)
				rescue
					return nil
				end
			end
		end
	end
end