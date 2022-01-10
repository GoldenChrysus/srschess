class CreateMasterMoveStats < ActiveRecord::Migration[6.1]
	def change
		create_view :master_move_stats, materialized: true
		add_index :master_move_stats, :fen_uuid, unique: true
	end
end
