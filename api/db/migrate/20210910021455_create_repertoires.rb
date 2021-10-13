class CreateRepertoires < ActiveRecord::Migration[6.1]
	def change
		create_table :repertoires do |t|
			t.string :name, null: false
			t.integer :side, null: false, index: true, limit: 1

			t.belongs_to :user, null: false, foreign_key: true, index: true

			t.timestamps
		end
	end
end
