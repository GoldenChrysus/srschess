class AddCopiedFlagToRepertoires < ActiveRecord::Migration[6.1]
	def change
		add_column :repertoires, :copied_from_public, :boolean, default: false, null: false
	end
end
