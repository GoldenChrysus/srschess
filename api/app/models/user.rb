class User < ApplicationRecord
	# Validation
	validates :email, presence: true, uniqueness: {:case_sensitive => false}
	validates :password, presence: true
	validates :bearer, presence: true, uniqueness: true

	# Relationships
	has_many :repertoires

	# Callbacks
	before_validation :create_bearer, on: :create
	after_validation :normalize_email, on: :create
	after_validation :hash_password, on: :create

	def self.bearer_exists?(bearer)
		user = self.where({ bearer: bearer }).first

		return !!user
	end

	def self.hash_value(value)
		return Digest::SHA256.hexdigest(value.to_s)
	end

	def self.login(email, password)
		hashed_password = self.hash_value(password)
		user            = self
			.where({
				:email    => email.to_s.downcase,
				:password => hashed_password
			})
			.first

		if (!user)
			# raise ApiErrors::AuthenticationError::LoginFailed.new
		end

		user.password = nil

		return user
	end

	private
		def normalize_email
			self.email.to_s.downcase!
		end

		def create_bearer
			while (!self.bearer || self.class.bearer_exists?(self.bearer))
				self.bearer = self.class.hash_value(SecureRandom.uuid)
			end
		end

		def hash_password
			self.password = self.class.hash_value(self.password)
		end
end
