module Types
	module Models
		class UserSettingType < Types::BaseObject
			# Fields
			field :id, ID, null: false
			field :key, String, null: false
			field :value, String, null: true
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
		end
	end
end
