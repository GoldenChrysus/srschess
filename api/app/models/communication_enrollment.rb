class CommunicationEnrollment < ApplicationRecord
	# Validations
	validates :user, presence: true

	# Relationships
	belongs_to :user, required: true
end
