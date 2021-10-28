class CreateEcoPositions < ActiveRecord::Migration[6.1]
	def change
		enable_extension "ltree" unless extension_enabled?("ltree")

		create_table :eco_positions, id: :string do |t|
			t.string :name, null: false
			t.string :fen, null: false, unique: true
			t.text :pgn, null: false, unique: true

			t.timestamps
		end

		add_column :eco_positions, :movelist, :ltree, null: false, unique: true
		add_index :eco_positions, :movelist, using: :gist
	end
end
