module Types
	module Queries
		class Repertoire < Types::BaseQuery
			# /repertoire
			type Types::Models::RepertoireType, null: false
			argument :slug, String, required: true
			
			def resolve(slug:)
				repertoire = ::Repertoire.where({ slug: slug }).first

				authorize repertoire, :show?

				repertoire.user_owned = (context[:user] != nil && repertoire.user.id == context[:user].id)

				repertoire
			end
		end
	end
end