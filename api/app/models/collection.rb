class Collection < ApplicationRecord
	# Validations
	validates :user, presence: true

	# Relationships
	belongs_to :user, required: true
	has_many :games
	# has_many :master_games, through: :master_games_to_collections

	# Callbacks
	after_validation :set_slug, on: :create

	def self.slug_exists?(slug)
		return (self.where(slug: slug).length != 0)
	end

	private
		def generate_slug
			nonce_len = 4
			nonce     = Digest::SHA256.hexdigest(SecureRandom.uuid)[0..(nonce_len - 1)]
			
			return (self.name.gsub(/[^A-Za-z\d ]/, "")[0..(255 - nonce_len - 2)] + " " + nonce).gsub(" ", "-").downcase
		end

		def set_slug
			loop do
				self.slug = self.generate_slug()

				break if (!self.class.slug_exists?(self.slug))
			end
		end
end
