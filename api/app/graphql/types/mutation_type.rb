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

		# /delete_repertoire_move
		field :delete_repertoire_move, mutation: Types::Mutations::DeleteRepertoireMove

		# /transpose_repertoire_move
		field :transpose_repertoire_move, mutation: Types::Mutations::TransposeRepertoireMove

		# /create_repertoire_move_note
		field :create_repertoire_move_note, mutation: Types::Mutations::CreateRepertoireMoveNote

		# /create_review
		field :create_review, mutation: Types::Mutations::CreateReview
	end
end
