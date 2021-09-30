class MakeLearnedItemMoveIndexUnique < ActiveRecord::Migration[6.1]
	def change
		remove_index :learned_items, name: "index_learned_items_on_move_id"
		add_index :learned_items, :move_id, :unique => true
	end
end
