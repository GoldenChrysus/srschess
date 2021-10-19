class CreateRepertoireMoveNotes < ActiveRecord::Migration[6.1]
	def change
		create_table :repertoire_move_notes do |t|
			t.belongs_to :repertoire_move, null: false, foreign_key: true, type: :uuid, unique: true
			t.string :value

			t.timestamps
		end
	end
end
