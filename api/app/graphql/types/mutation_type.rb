module Types
	class MutationType < Types::BaseObject
		# /create_user
		field :create_user, mutation: Types::Mutations::CreateUser

		# /edit_user_setting
		field :edit_user_setting, mutation: Types::Mutations::EditUserSetting

		# /create_communication_enrollment
		field :create_communication_enrollment, mutation: Types::Mutations::CreateCommunicationEnrollment

		# /create_repertoire
		field :create_repertoire, mutation: Types::Mutations::CreateRepertoire

		# /clone_repertoire
		field :clone_repertoire, mutation: Types::Mutations::CloneRepertoire

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

		# /reorder_repertoire_move
		field :reorder_repertoire_move, mutation: Types::Mutations::ReorderRepertoireMove

		# /import_eco_to_repertoire
		field :import_eco_to_repertoire, mutation: Types::Mutations::ImportEcoToRepertoire

		# /create_repertoire_move_note
		field :create_repertoire_move_note, mutation: Types::Mutations::CreateRepertoireMoveNote

		# /create_repertoire_move_arrow_datum
		field :create_repertoire_move_arrow_datum, mutation: Types::Mutations::CreateRepertoireMoveArrowDatum

		# /create_review
		field :create_review, mutation: Types::Mutations::CreateReview

		# /create_collection
		field :create_collection, mutation: Types::Mutations::CreateCollection

		# /edit_collection
		field :edit_collection, mutation: Types::Mutations::EditCollection

		# /delete_collection
		field :delete_collection, mutation: Types::Mutations::DeleteCollection

		# /create_collection_games
		field :create_collection_games, mutation: Types::Mutations::CreateCollectionGames

		# /save_master_game
		field :save_master_game, mutation: Types::Mutations::SaveMasterGame

		# /create_checkout
		field :create_checkout, mutation: Types::Mutations::CreateCheckout
	end
end
