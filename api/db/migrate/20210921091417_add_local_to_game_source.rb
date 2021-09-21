class AddLocalToGameSource < ActiveRecord::Migration[6.1]
	def change
		execute <<-SQL
			ALTER TYPE
				game_source
			ADD VALUE
				'local'
		SQL
	end
end
