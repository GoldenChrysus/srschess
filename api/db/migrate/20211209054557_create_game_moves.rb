class CreateGameMoves < ActiveRecord::Migration[6.1]
	def change
		create_table :game_moves do |t|
			t.belongs_to :game, null: false, foreign_key: true
			t.integer :ply, null: false
			t.string :move, null: false
			t.string :fen, null: false
			t.string :uci

			t.timestamps
		end
	end
end
