module Types
	module Models
		class UserType < Types::BaseObject
			# Fields
			field :id, ID, null: false
			field :email, String, null: false
			field :uid, String, null: true
			field :tier, Int, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

			# Relationships
			field :repertoires, [Types::Models::RepertoireType], null: true
			field :collections, [Types::Models::CollectionType], null: true
			field :settings, [Types::Models::UserSettingType], null: true
		end
	end
end
