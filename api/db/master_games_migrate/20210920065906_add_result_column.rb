class AddResultColumn < ActiveRecord::Migration[6.1]
	def change
		add_column :master_games, :result, :integer, null: false, limit: 1
	end
end
