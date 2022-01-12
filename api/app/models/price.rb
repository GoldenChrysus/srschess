class Price < ApplicationRecord
	# Validation
	validates :stripe_id, presence: true, uniqueness: true
	validates :tier, presence: true, uniqueness: true

	def self.attributes_protected_by_default
		# default is ["id", "type"]
		["type"]
	end

	def self.update_or_create(objects)
		objects.each do |attributes|
			poem = self.find_or_initialize_by(id: attributes[:id])

			poem.assign_attributes(attributes)
			poem.save
		end
	end
end
