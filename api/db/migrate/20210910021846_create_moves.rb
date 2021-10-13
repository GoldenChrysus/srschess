class CreateMoves < ActiveRecord::Migration[6.1]
	def change
		enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")

		create_table :repertoire_moves, id: :uuid do |t|
			t.integer :move_number, null: false
			t.string :move, null: false
			t.text :fen, null: false
			t.integer :sort, null: false

			t.belongs_to :repertoire, null: false, foreign_key: true, index: true
			t.references :parent, type: :uuid, null: true, foreign_key: { to_table: :repertoire_moves }, index: true

			t.timestamps
		end
	end
end
