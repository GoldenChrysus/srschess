module Types
	module Queries
		class Collection < Types::BaseQuery
			# /collection
			type Types::Models::CollectionType, null: false
			argument :slug, String, required: true
			
			def resolve(slug:)
				collection = ::Collection.where({ slug: slug }).first

				authorize collection, :show?

				collection.user_owned = (context[:user] != nil && collection.user.id == context[:user].id)

				collection
			end
		end
	end
end