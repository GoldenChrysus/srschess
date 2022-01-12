class CreateCustomers < ActiveRecord::Migration[6.1]
	def change
		create_table :customers do |t|
			t.belongs_to :user, null: false, foreign_key: true, index: { unique: true }
			t.string :stripe_id, null: false

			t.index :stripe_id, unique: true

			t.timestamps
		end
	end
end
