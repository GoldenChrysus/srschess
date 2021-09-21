class RemoveDefaults < ActiveRecord::Migration[6.1]
	def change
		change_column_default(:master_games, :source, nil)
		change_column_default(:master_games, :event, nil)
		change_column_default(:master_games, :round, nil)
	end
end
