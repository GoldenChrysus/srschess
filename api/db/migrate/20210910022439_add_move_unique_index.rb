class AddMoveUniqueIndex < ActiveRecord::Migration[6.1]
	def change
		add_index :repertoire_moves, [:repertoire_id, :move_number, :move, :fen], :unique => true, name: "repertoire_moves_uniqueness_index"
	end
end
