class CreateFenMasterGames < ActiveRecord::Migration[6.1]
	def change
		create_view :fen_master_games, materialized: true
		add_index :fen_master_games, :fen_uuid, unique: true
	end
end
