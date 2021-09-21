class MasterGame < ApplicationRecord
	# Validation
	validates :movelist, presence: true
	validates :white, presence: true
	validates :black, presence: true
	validates :white_elo, presence: true
	validates :black_elo, presence: true
	validates :result, presence: true
	validates :pgn, presence: true
	validates :source, presence: true

	enum result: {white: "W", black: "B", draw: "D"}
	enum source: {pgnmentor: "pgnmentor", chessbomb: "chessbomb", local: "local"}
end
