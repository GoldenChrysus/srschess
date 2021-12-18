class CreateMasterGames < ActiveRecord::Migration[6.1]
	def change
		enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")
		enable_extension "ltree" unless extension_enabled?("ltree")

		create_table :master_games, id: :uuid do |t|
			t.string :white, null: false
			t.string :black, null: false
			t.integer :white_elo
			t.integer :black_elo
			t.integer :year
			t.integer :month
			t.integer :day

			t.string :eco
			t.text :pgn, null: false

			t.timestamps
		end

		add_column :master_games, :movelist, :ltree, null: false
	end
end
