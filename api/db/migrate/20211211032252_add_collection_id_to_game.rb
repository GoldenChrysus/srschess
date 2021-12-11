class AddCollectionIdToGame < ActiveRecord::Migration[6.1]
	def change
		add_reference :games, :collection, index: true, null: true
	end
end
