class AddSlugToEcoPosition < ActiveRecord::Migration[6.1]
	def change
		add_column :eco_positions, :slug, :string, null: false
		add_index :eco_positions, :slug, unique: true
	end
end
