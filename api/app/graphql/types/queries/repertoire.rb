module Types
	module Queries
		class Repertoire < Types::BaseQuery
			# /repertoire
			type Types::Models::RepertoireType, null: false
			argument :slug, String, required: true
			argument :mode, String, required: false
			
			def resolve(slug:, mode:)
				repertoire = ::Repertoire.where({ slug: slug }).first

				authorize repertoire, :show?

				if (mode == "review")
					authorize repertoire, :update?
				end

				repertoire.user_owned = (context[:user] != nil && repertoire.user.id == context[:user].id)

				repertoire
			end
		end
	end
end