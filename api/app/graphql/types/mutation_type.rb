module Types
	class MutationType < Types::BaseObject
		# /create_user
		field :create_user, mutation: Mutations::CreateUser
		field :create_repertoire, mutation: Mutations::CreateRepertoire
	end
end
