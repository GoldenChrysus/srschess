module Types
	module Queries
		class UserSettings < Types::BaseQuery
			# /user_settings
			type [Types::Models::UserSettingType], null: false
			argument :category, String, required: true

			def resolve(category:)
				if (context[:user] == nil)
					return []
				end

				category = SettingCategory.where(key: category).first

				context[:user].settings.where(setting_category: category).all
			end
		end
	end
end