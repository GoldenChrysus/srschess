class CreateFens < ActiveRecord::Migration[6.1]
	def change
		create_view :fens, materialized: true
		add_index :fens, :id, unique: true
		add_index :fens, :fen, unique: true
	end
end
