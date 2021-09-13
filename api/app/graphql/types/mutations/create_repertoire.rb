module Types
	module Mutations
		class CreateRepertoire < BaseMutation
			argument :name, String, required: true
			argument :side, String, required: true
			argument :user_id, ID, required: true

			field :repertoire, Types::Models::RepertoireType, null: true
			field :errors, [String], null: false

			def resolve(name:, side:, user_id:)
				repertoire = Repertoire.new(
					name: name,
					side: side,
					user: User.find(user_id)
				)

				if (repertoire.save)
					{
						repertoire: repertoire,
						errors: []
					}
				else
					{
						repertoire: nil,
						errors: repertoire.errors.full_messages
					}
				end
			end
		end
	end
end