module Types
	class BaseQuery < GraphQL::Schema::Resolver
		include Pundit

		def current_user
			return context[:user]
		end
	end
end