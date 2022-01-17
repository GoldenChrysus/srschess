class SettingCategory < ApplicationRecord
	# Validation
	validates :key, presence: true, uniqueness: true

	# Types
	enum key: {notifications: 0, connections: 1}

	def self.update_or_create(objects)
		objects.each do |attributes|
			record = self.find_or_initialize_by(key: attributes[:key])

			record.assign_attributes(attributes)
			record.save
		end
	end
end
