module Types
	class MutationType < Types::BaseObject
		# /create_user
		field :create_user, mutation: Mutations::CreateUser
	end
end
