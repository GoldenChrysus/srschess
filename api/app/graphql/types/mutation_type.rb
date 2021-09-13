module Types
	class MutationType < Types::BaseObject
		# /create_user
		field :create_user, mutation: Types::Mutations::CreateUser
		field :create_repertoire, mutation: Types::Mutations::CreateRepertoire
	end
end
