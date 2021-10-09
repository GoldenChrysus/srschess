class AddIndexToMasterGameMoves < ActiveRecord::Migration[6.1]
	def change
		add_index :master_game_moves, :fen
		add_index :master_game_moves, :ply
		add_index :master_game_moves, [:master_game_id, :ply], :unique => true
	end
end
