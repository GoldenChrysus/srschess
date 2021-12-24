class AddIndexToMasterGames < ActiveRecord::Migration[6.1]
	def change
		add_index :master_games, :white
		add_index :master_games, :black
		add_index :master_games, :white_elo
		add_index :master_games, :black_elo
		add_index :master_games, :white_title
		add_index :master_games, :black_title
		add_index :master_games, :year
		add_index :master_games, :month
		add_index :master_games, :day
		add_index :master_games, :eco
		add_index :master_games, :result
	end
end
