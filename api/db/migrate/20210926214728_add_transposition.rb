class AddTransposition < ActiveRecord::Migration[6.1]
	def change
		add_reference :repertoire_moves, :transposition, type: :uuid, foreign_key: { to_table: :repertoire_moves }, index: true, null: true
	end
end
