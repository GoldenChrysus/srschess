class CreatePrices < ActiveRecord::Migration[6.1]
	def change
		create_table :prices, id: :string do |t|
			t.string :stripe_id, null: false, index: { unique: true }
			t.integer :tier, null: false, index: { unique: true }

			t.timestamps
		end
	end
end
