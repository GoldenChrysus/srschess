class EcoPosition < ApplicationRecord
	# Validation
	validates :name, presence: true
	validates :movelist, presence: true, uniqueness: true
	validates :pgn, presence: true, uniqueness: true
	validates :fen, presence: true, uniqueness: true

	def self.update_or_create(objects)
		objects.each do |attributes|
			record = self.find_or_initialize_by(fen: attributes[:fen])

			record.assign_attributes(attributes)
			record.save
		end
	end
end
