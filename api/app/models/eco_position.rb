class EcoPosition < ApplicationRecord
	# Validation
	validates :name, presence: true
	validates :movelist, presence: true, uniqueness: true
	validates :pgn, presence: true, uniqueness: true
	validates :fen, presence: true, uniqueness: true
end
