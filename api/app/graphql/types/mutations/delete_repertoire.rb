module Types
	module Mutations
		class DeleteRepertoire < BaseMutation
			argument :id, ID, required: true

			field :errors, [String], null: false

			def resolve(id:)
				repertoire = ::Repertoire.find(id)

				authorize repertoire, :delete?

				if (repertoire.destroy)
					{
						errors: []
					}
				else
					{
						errors: repertoire.errors.full_messages
					}
				end
			end
		end
	end
end