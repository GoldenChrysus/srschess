class AddTransposition < ActiveRecord::Migration[6.1]
	def change
		add_reference :moves, :transposition, type: :uuid, foreign_key: { to_table: :moves }, index: true, null: true
	end
end
