module Types
	module Mutations
		class CreateUser < BaseMutation
			argument :email, String, required: true
			argument :password, String, required: true

			field :user, Types::Models::UserType, null: true
			field :errors, [String], null: false

			def resolve(email:, password:)
				user = User.new(email: email, password: password)

				if (user.save)
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