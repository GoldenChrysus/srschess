module Types
	module Mutations
		class DeleteRepertoireMove < BaseMutation
			argument :id, String, required: true

			field :errors, [String], null: false

			def resolve(id:)
				move = ::RepertoireMove.find(id)

				authorize move, :delete?

				if (move.destroy)
					{
						errors: []
					}
				else
					{
						errors: move.errors.full_messages
					}
				end
			end
		end
	end
end