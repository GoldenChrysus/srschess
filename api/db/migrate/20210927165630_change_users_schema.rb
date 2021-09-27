class ChangeUsersSchema < ActiveRecord::Migration[6.1]
	def change
		remove_column :users, :password
		remove_column :users, :bearer
		add_column :users, :uid, :text, unique: true, null: false, default: "?"
	end
end
