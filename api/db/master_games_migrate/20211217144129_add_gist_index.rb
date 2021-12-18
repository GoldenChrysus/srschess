class AddGistIndex < ActiveRecord::Migration[6.1]
	def change
		execute "SET max_stack_depth TO '3584 kB';"
		add_index :master_games, :movelist, using: :gist
	end
end
