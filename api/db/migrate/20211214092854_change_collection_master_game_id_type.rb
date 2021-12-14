class ChangeCollectionMasterGameIdType < ActiveRecord::Migration[6.1]
	def change
		remove_reference :master_games_to_collections, :master_game
		add_reference :master_games_to_collections, :master_game, null: false, index: true, type: :uuid

		add_index :master_games_to_collections, [:collection_id, :master_game_id], :unique => true, name: "idx_master_games_to_collections_on_collection_and_master_game"
	end
end
