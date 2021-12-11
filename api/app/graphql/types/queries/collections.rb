module Types
	module Queries
		class Collections < Types::BaseQuery
			# /collections
			type [Types::Models::CollectionType], null: false
			
			def resolve
				return [] unless context[:user] != nil
				context[:user].collections
			end
		end
	end
end