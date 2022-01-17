class AddSourceIdToGames < ActiveRecord::Migration[6.1]
	def change
		add_column :games, :source_id, :string, null: true

		execute "
			CREATE UNIQUE INDEX index_games_on_source_id ON games (source, source_id) WHERE (source_id IS NOT NULL)
		"
	end
end
