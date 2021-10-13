class AddUciColumn < ActiveRecord::Migration[6.1]
	def change
		add_column :repertoire_moves, :uci, :string, null: false
	end
end
