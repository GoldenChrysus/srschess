class AddEnumColumns < ActiveRecord::Migration[6.1]
	def change
		execute <<-SQL
			CREATE TYPE
				game_source
			AS
				ENUM
					('pgnmentor', 'chessbomb')
		SQL
		execute <<-SQL
			CREATE TYPE
				game_result
			AS
				ENUM
					('W', 'B', 'D')
		SQL

		remove_column :master_games, :source
		add_column :master_games, :source, :game_source, null: false
		remove_column :master_games, :result
		add_column :master_games, :result, :game_result, null: false
	end
end
