module Types
	module Mutations
		class EditUserSettings < BaseMutation
			class Setting < Types::BaseInputObject
				description "Key/value setting"

				argument :key, String, required: true
				argument :category, String, required: true
				argument :value, String, required: false
			end

			argument :settings, [Setting], required: true
			argument :value, String, required: false

			field :user_settings, [Types::Models::UserSettingType], null: false

			def resolve(settings:)
				result = {
					user_settings: []
				}
				user = context[:user]

				return result unless user != nil

				settings.each do |input_setting|
					setting = ::UserSetting.where(key: input_setting[:key], user: user).first

					if (setting == nil)
						category = ::SettingCategory.find_by_key(input_setting[:category])
						setting  = ::UserSetting.create(
							user: user,
							key: input_setting[:key],
							setting_category: category
						)
					end

					authorize setting, :update?

					setting.value = input_setting[:value]
					
					setting.save
					result[:user_settings].push(setting)
				end

				result
			end
		end
	end
end