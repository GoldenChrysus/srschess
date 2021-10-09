class AddUciToMasterGameMoves < ActiveRecord::Migration[6.1]
	def change
		add_column :master_game_moves, :uci, :string
		change_column_null :master_game_moves, :fen, false
		change_column_null :master_game_moves, :move, false
		change_column_null :master_game_moves, :ply, false
		change_column_null :master_game_moves, :master_game_id, false
	end
end
