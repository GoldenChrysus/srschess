class Subscription < ApplicationRecord
	# Validation
	validates :customer, presence: true
	validates :price, presence: true

	# Relationships
	belongs_to :customer, required: true
	belongs_to :price, required: true
end
