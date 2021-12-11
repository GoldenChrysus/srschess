class CreateMasterGamesToCollections < ActiveRecord::Migration[6.1]
	def change
		create_table :master_games_to_collections do |t|
			t.belongs_to :collection, null: false, foreign_key: true
			t.belongs_to :master_game, null: false

			t.timestamps
		end
	end
end
