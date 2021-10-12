class AddPublicToRepertoires < ActiveRecord::Migration[6.1]
	def change
		add_column :repertoires, :public, :boolean, default: false, null: false
	end
end
