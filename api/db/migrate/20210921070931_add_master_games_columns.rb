class AddMasterGamesColumns < ActiveRecord::Migration[6.1]
	def change
		add_column :master_games, :white_fide_id, :string
		add_column :master_games, :white_title, :string
		add_column :master_games, :black_fide_id, :string
		add_column :master_games, :black_title, :string
		add_column :master_games, :source, :string, default: :pgnmentor
		add_column :master_games, :event, :string, default: "?"
		add_column :master_games, :round, :string, default: "?"
	end
end
