module Types
	class BaseMutation < GraphQL::Schema::RelayClassicMutation
		include Pundit

		argument_class Types::BaseArgument
		field_class Types::BaseField
		input_object_class Types::BaseInputObject
		object_class Types::BaseObject

		def current_user
			return context[:user]
		end
	end
end
