class AddSlugToCollections < ActiveRecord::Migration[6.1]
	def change
		add_column :collections, :slug, :string, null: false
		add_index :collections, :slug, :unique => true
	end
end
