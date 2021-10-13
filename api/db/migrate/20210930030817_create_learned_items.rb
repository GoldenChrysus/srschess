class CreateLearnedItems < ActiveRecord::Migration[6.1]
	def change
		create_table :learned_items do |t|
			t.belongs_to :repertoire_move, null: false, foreign_key: true, index: true, type: :uuid, unique: true
			t.integer :level
			t.datetime :next_review

			t.timestamps
		end
	end
end
