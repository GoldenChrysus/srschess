module Types
	module Mutations
		class CreateCollection < BaseMutation
			argument :name, String, required: true

			field :collection, Types::Models::CollectionType, null: true
			field :errors, [String], null: false

			def resolve(name:)
				authorize nil, :create_collections?, policy_class: PremiumPolicy

				collection = Collection.new(
					name: name,
					user: context[:user]
				)

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