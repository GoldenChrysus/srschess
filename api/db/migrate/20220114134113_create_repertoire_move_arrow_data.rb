class CreateRepertoireMoveArrowData < ActiveRecord::Migration[6.1]
	def change
		create_table :repertoire_move_arrow_data do |t|
			t.belongs_to :repertoire_move, type: :uuid, null: false, foreign_key: true, index: { unique: true }
			t.string :data, array: true, default: []

			t.timestamps
		end
	end
end
