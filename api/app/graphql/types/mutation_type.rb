module Types
	class MutationType < Types::BaseObject
		# /create_user
		field :create_user, mutation: Types::Mutations::CreateUser

		# /create_repertoire
		field :create_repertoire, mutation: Types::Mutations::CreateRepertoire

		# /edit_repertoire
		field :edit_repertoire, mutation: Types::Mutations::EditRepertoire

		# /delete_repertoire
		field :delete_repertoire, mutation: Types::Mutations::DeleteRepertoire

		# /create_repertoire_move
		field :create_repertoire_move, mutation: Types::Mutations::CreateRepertoireMove

		# /transpose_repertoire_move
		field :transpose_repertoire_move, mutation: Types::Mutations::TransposeRepertoireMove

		# /create_review
		field :create_review, mutation: Types::Mutations::CreateReview
	end
end
