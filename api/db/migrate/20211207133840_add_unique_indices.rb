class AddUniqueIndices < ActiveRecord::Migration[6.1]
	def change
		remove_index :repertoire_move_notes, name: "index_repertoire_move_notes_on_repertoire_move_id"
		add_index :repertoire_move_notes, :repertoire_move_id, :unique => true

		remove_index :learned_items, name: "index_learned_items_on_repertoire_move_id"
		add_index :learned_items, :repertoire_move_id, :unique => true

		add_index :users, :email, :unique => true
	end
end
