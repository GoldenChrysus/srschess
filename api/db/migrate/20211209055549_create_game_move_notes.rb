class CreateGameMoveNotes < ActiveRecord::Migration[6.1]
	def change
		create_table :game_move_notes do |t|
			t.belongs_to :game_move, null: false, foreign_key: true
			t.string :value

			t.timestamps
		end
	end
end
