class LearnedItem < ApplicationRecord
	# Validations
	validates :level, presence: true
	validates :move, presence: true, uniqueness: true

	# Relationships
	belongs_to :move
end
