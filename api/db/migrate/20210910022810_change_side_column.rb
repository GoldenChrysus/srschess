class ChangeSideColumn < ActiveRecord::Migration[6.1]
	def change
		remove_column :repertoires, :side
		add_column :repertoires, :side, :integer
	end
end