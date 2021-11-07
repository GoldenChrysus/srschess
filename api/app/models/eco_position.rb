class EcoPosition < ApplicationRecord
	# Validation
	validates :name, presence: true
	validates :movelist, presence: true, uniqueness: true
	validates :pgn, presence: true, uniqueness: true
	validates :fen, presence: true, uniqueness: true

	def self.update_or_create(objects)
		objects.each do |attributes|
			poem = self.find_or_initialize_by(fen: attributes[:fen])

			poem.assign_attributes(attributes)
			poem.save
		end
	end
end
