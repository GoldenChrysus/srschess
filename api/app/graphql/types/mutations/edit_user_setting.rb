module Types
	module Mutations
		class EditUserSetting < BaseMutation
			argument :id, ID, required: true
			argument :value, String, required: false

			field :user_setting, Types::Models::UserSettingType, null: true
			field :errors, [String], null: false

			def resolve(id:, value:)
				setting = ::UserSetting.find(id)

				authorize setting, :update?

				setting.value = value

				if (setting.save)
					{
						user_setting: setting,
						errors: []
					}
				else
					{
						user_setting: nil,
						errors: setting.errors.full_messages
					}
				end
			end
		end
	end
end