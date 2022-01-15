class SettingCategory < ApplicationRecord
	# Validation
	validates :key, presence: true, uniqueness: true

	# Types
	enum key: {notifications: 0}
end
