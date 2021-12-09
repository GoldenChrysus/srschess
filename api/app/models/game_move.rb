class GameMove < ApplicationRecord
	# Validation
	validates :game, presence: true
	validates :ply, presence: true
	validates :move, presence: true
	validates :fen, presence: true

	# Relationships
	belongs_to :game, required: true
end
