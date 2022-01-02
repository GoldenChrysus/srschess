class ErrorLog < ApplicationRecord
	# Relationships
	belongs_to :user, required: false
end
