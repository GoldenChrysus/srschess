class CreateUserSettings < ActiveRecord::Migration[6.1]
	def change
		create_table :user_settings do |t|
			t.belongs_to :setting_category, null: false, foreign_key: true
			t.belongs_to :user, null: false, foreign_key: true
			t.string :key, null: false
			t.string :value

			t.index [:user_id, :key], unique: true

			t.timestamps
		end

		category = SettingCategory.where(key: :notifications).first

		User.all.each do |user|
			["account_changes", "training_reminders", "feature_releases", "chess_news"].each do |setting_key|
				UserSetting.create(
					user: user,
					setting_category: category,
					key: setting_key,
					value: "1"
				)
			end
		end
	end
end
