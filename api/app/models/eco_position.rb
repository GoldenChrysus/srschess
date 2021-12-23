class EcoPosition < ApplicationRecord
	# Validation
	validates :code, presence: true
	validates :name, presence: true
	validates :movelist, presence: true, uniqueness: true
	validates :pgn, presence: true, uniqueness: true
	validates :fen, presence: true, uniqueness: true

	# Callbacks
	after_validation :set_slug, on: :create

	def self.slug_exists?(slug)
		return (self.where(slug: slug).length != 0)
	end

	def self.update_or_create(objects)
		objects.each do |attributes|
			record = self.find_or_initialize_by(fen: attributes[:fen])

			record.assign_attributes(attributes)
			record.save
		end
	end

	private
		def set_slug
			return if (self.slug != nil)

			loop do
				self.slug = GenerateSlug.call(value: self.code + " " + self.name).result

				break if (!self.class.slug_exists?(self.slug))
			end
		end
end
