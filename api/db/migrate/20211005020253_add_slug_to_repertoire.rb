class AddSlugToRepertoire < ActiveRecord::Migration[6.1]
	def change
		add_column :repertoires, :slug, :string, unique: true

		Repertoire.all.each do |repertoire|
			repertoire.save!
		end
	end
end
