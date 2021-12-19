class ChangeGameDateType < ActiveRecord::Migration[6.1]
	def change
		change_column :games, :date, :string
	end
end
