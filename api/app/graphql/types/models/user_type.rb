module Types
	module Models
		class UserType < Types::BaseObject
			# Fields
			field :id, ID, null: false
			field :email, String, null: false
			field :password, String, null: true
			field :bearer, String, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :repertoires, [Types::Models::RepertoireType], null: true
		end
	end
end
