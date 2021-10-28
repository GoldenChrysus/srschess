class CreateEcoPositions < ActiveRecord::Migration[6.1]
	def change
		enable_extension "ltree" unless extension_enabled?("ltree")

		create_table :eco_positions do |t|
			t.string :code, null: false
			t.string :name, null: false
			t.string :fen, null: false
			t.text :pgn, null: false

			t.timestamps

			t.index :fen, unique: true
			t.index :pgn, unique: true
		end

		add_column :eco_positions, :movelist, :ltree, null: false, unique: true
		add_index :eco_positions, :movelist, using: :gist
		add_index :eco_positions, [:code, :fen], :unique => true
	end
end
