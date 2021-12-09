class CreateGames < ActiveRecord::Migration[6.1]
	def change
		create_table :games do |t|
			t.belongs_to :user, null: false, foreign_key: true
			t.datetime :date
			t.text :pgn, null: false
			t.ltree :movelist, null: false
			t.integer :source, null: false

			t.timestamps
		end
	end
end
