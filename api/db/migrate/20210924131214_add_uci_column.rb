class AddUciColumn < ActiveRecord::Migration[6.1]
	def change
		add_column :moves, :uci, :string, null: false
	end
end
