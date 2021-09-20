class AddResultColumn < ActiveRecord::Migration[6.1]
	def change
		add_column :master_games, :result, :string, null: false
	end
end
