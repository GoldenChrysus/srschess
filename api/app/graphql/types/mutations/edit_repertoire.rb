module Types
	module Mutations
		class EditRepertoire < BaseMutation
			argument :id, ID, required: true
			argument :name, String, required: true
			argument :public, Boolean, required: true

			field :repertoire, Types::Models::RepertoireType, null: true
			field :errors, [String], null: false

			def resolve(id:, name:, public:)
				repertoire = ::Repertoire.find(id)

				authorize repertoire, :update?

				repertoire.name   = name
				repertoire.public = public

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