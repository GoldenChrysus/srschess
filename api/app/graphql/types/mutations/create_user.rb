module Types
	module Mutations
		class CreateUser < BaseMutation
			argument :email, String, required: true
			argument :uid, String, required: true
			argument :type, String, required: true

			field :user, Types::Models::UserType, null: true
			field :errors, [String], null: false

			def resolve(email:, uid:, type:)
				user = User.where({ uid: uid }).first
				good = (user != nil)

				if (!good and type == "auth")
					user = User.new(email: email, uid: uid)
					good = user.save
				elsif (user == context[:user])
					user.email = email
					user.uid   = uid
					
					user.save
				end

				if (good or type == "token")
					{
						user: user,
						errors: []
					}
				else
					{
						user: nil,
						errors: user.errors.full_messages
					}
				end
			end
		end
	end
end