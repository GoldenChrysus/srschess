class AddNamesToMasterGames < ActiveRecord::Migration[6.1]
	def change
		add_column :master_games, :white_names, :string, array: true, default: []
		add_column :master_games, :black_names, :string, array: true, default: []

		add_index :master_games, :white_names
		add_index :master_games, :black_names
	end
end
