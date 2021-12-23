class Collection < ApplicationRecord
	attr_accessor :game_count

	# Validations
	validates :user, presence: true

	# Relationships
	belongs_to :user, required: true
	has_many :games
	# has_many :master_games, through: :master_games_to_collections

	# Callbacks
	after_validation :set_slug, on: :create

	def game_count
		self.games.length
	end

	def self.slug_exists?(slug)
		return (self.where(slug: slug).length != 0)
	end

	private
		def set_slug
			loop do
				self.slug = GenerateSlug.call(value: self.name).result

				break if (!self.class.slug_exists?(self.slug))
			end
		end
end
