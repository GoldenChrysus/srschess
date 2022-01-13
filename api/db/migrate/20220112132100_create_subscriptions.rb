class CreateSubscriptions < ActiveRecord::Migration[6.1]
	def change
		create_table :subscriptions do |t|
			t.string :stripe_id, null: false, index: { unique: true }
			t.belongs_to :customer, null: false, foreign_key: true
			t.belongs_to :price, null: false, foreign_key: true, type: :string
			t.timestamp :started_at, null: false
			t.timestamp :ended_at

			t.timestamps
		end
	end
end
