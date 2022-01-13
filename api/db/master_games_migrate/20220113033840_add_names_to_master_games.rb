class AddNamesToMasterGames < ActiveRecord::Migration[6.1]
	def change
		add_column :master_games, :white_name, :string
		add_column :master_games, :black_name, :string

		add_index :master_games, :white_name
		add_index :master_games, :black_name
	end
end
