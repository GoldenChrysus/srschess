class ChangeUniqueMoveIndex < ActiveRecord::Migration[6.1]
	def change
		remove_index :moves, name: "index_moves_on_repertoire_id_and_move_number_and_move"
		add_index :moves, [:repertoire_id, :move_number, :move, :fen], :unique => true
	end
end