class AddEventToGames < ActiveRecord::Migration[6.1]
	def change
		add_column :games, :event, :string, null: true
		add_column :games, :round, :string, null: true
	end
end
