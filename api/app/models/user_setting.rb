class UserSetting < ApplicationRecord
	# Validation
	validates :setting_category, presence: true
	validates :user, presence: true
	validates :key, presence: true

	# Relationships
	belongs_to :setting_category, required: true
	belongs_to :user, required: true
end
