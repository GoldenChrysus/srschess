class FixNoteIndices < ActiveRecord::Migration[6.1]
	def change
		remove_index :game_move_notes, name: "index_game_move_notes_on_game_move_id"
		add_index :game_move_notes, :game_move_id, :unique => true
	end
end
