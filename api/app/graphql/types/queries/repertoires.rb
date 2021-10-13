module Types
	module Queries
		class Repertoires < Types::BaseQuery
			# /repertoires
			type [Types::Models::RepertoireType], null: false
			
			def resolve
				return [] unless context[:user] != nil
				context[:user].repertoires
			end
		end
	end
end