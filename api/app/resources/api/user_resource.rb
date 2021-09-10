module Api
	class UserResource < JSONAPI::Resource
		attributes :email, :password, :bearer, :created_at

		has_many :repertoires

		filters :email

		def fetchable_fields
			super - [:password]
		end

		# Attribute controls
		def self.updatable_fields(context)
			# Bearer may never be updated
			super - [:bearer]
		end
	end
end