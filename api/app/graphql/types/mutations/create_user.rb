module Types
	module Mutations
		class CreateUser < BaseMutation
			argument :email, String, required: true
			argument :uid, String, required: true

			field :user, Types::Models::UserType, null: true
			field :errors, [String], null: false

			def resolve(email:, uid:)
				user = User.where({ uid: uid }).first
				good = (user != nil)

				if (!good)
					user = User.new(email: email, uid: uid)
					good = user.save
				elsif (user == context[:user])
					user.email = email
					user.uid   = uid
					
					user.save
				end

				if (good)
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