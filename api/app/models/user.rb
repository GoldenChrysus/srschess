class User < ApplicationRecord
	# Validation
	validates :email, presence: true, uniqueness: {:case_sensitive => false}
	validates :uid, presence: true, uniqueness: true

	# Relationships
	has_many :repertoires, dependent: :destroy
	has_many :collections, dependent: :destroy
	has_many :communication_enrollments, dependent: :destroy

	# Callbacks
	after_validation :normalize_email, on: :create

	private
		def normalize_email
			self.email.to_s.downcase!
		end
end
