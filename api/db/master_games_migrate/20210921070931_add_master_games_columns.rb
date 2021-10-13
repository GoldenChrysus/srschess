class AddMasterGamesColumns < ActiveRecord::Migration[6.1]
	def change
		add_column :master_games, :white_fide_id, :string
		add_column :master_games, :white_title, :string
		add_column :master_games, :black_fide_id, :string
		add_column :master_games, :black_title, :string
		add_column :master_games, :source, :integer, null: false, limit: 2
		add_column :master_games, :event, :string
		add_column :master_games, :round, :string
	end
end
