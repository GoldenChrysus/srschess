class AddGistIndex < ActiveRecord::Migration[6.1]
	def change
		add_index :master_games, :movelist, using: :gist
	end
end
