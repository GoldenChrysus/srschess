class EcoPosition < ApplicationRecord
	# Validation
	validates :name, presence: true
	validates :movelist, presence: true
	validates :pgn, presence: true
	validates :fen, presence: true
end
