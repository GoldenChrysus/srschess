class CreateSettingCategories < ActiveRecord::Migration[6.1]
	def change
		create_table :setting_categories do |t|
			t.integer :key, null: false

			t.index :key, unique: true

			t.timestamps
		end

		SettingCategory.create(key: :notifications)
	end
end
