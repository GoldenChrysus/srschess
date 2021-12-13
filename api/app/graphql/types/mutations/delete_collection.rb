module Types
	module Mutations
		class DeleteCollection < BaseMutation
			argument :id, ID, required: true

			field :errors, [String], null: false

			def resolve(id:)
				collection = ::Collection.find(id)

				authorize collection, :delete?

				if (collection.destroy)
					{
						errors: []
					}
				else
					{
						errors: collection.errors.full_messages
					}
				end
			end
		end
	end
end