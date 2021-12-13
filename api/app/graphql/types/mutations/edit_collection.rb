module Types
	module Mutations
		class EditCollection < BaseMutation
			argument :id, ID, required: true
			argument :name, String, required: true

			field :collection, Types::Models::CollectionType, null: true
			field :errors, [String], null: false

			def resolve(id:, name:)
				collection = ::Collection.find(id)

				authorize collection, :update?

				collection.name = name

				if (collection.save)
					{
						collection: collection,
						errors: []
					}
				else
					{
						collection: nil,
						errors: collection.errors.full_messages
					}
				end
			end
		end
	end
end