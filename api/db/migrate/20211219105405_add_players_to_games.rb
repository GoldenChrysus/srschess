class AddPlayersToGames < ActiveRecord::Migration[6.1]
	def change
		add_column :games, :white, :string, null: true
		add_column :games, :black, :string, null: true
	end
end
