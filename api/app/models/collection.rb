class Collection < ApplicationRecord
	# Validations
	validates :user, presence: true

	# Relationships
	belongs_to :user, required: true
	has_many :games
	has_many :master_games, through: :master_games_to_collections
end
