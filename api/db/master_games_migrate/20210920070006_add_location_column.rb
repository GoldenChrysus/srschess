class AddLocationColumn < ActiveRecord::Migration[6.1]
	def change
		add_column :master_games, :location, :string
	end
end
