class CreateSideEnum < ActiveRecord::Migration[6.1]
	def change
		execute <<-SQL
			CREATE TYPE
				side
			AS
				ENUM
					('W', 'B')
		SQL

		remove_column :repertoires, :side
		add_column :repertoires, :side, :side, null: false
		add_index :repertoires, :side
	end
end
