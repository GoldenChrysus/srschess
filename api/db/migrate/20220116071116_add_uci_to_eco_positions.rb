class AddUciToEcoPositions < ActiveRecord::Migration[6.1]
	def change
		add_column :eco_positions, :uci, :string
	end
end
