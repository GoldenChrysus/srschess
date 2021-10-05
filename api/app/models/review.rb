class Review < ApplicationRecord
	# Validation
	validates :learned_item, presence: true
	validates :incorrect_attempts, presence: true
	validates :attempts, presence: true
	validates :average_correct_time, presence: true
	validates :average_time, presence: true

	# Relationships
	belongs_to :learned_item, required: true
end
