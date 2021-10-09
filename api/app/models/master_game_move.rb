class MasterGameMove < ApplicationRecord
	# Validations
	validates :master_game, presence: true
	validates :ply, presence: true
	validates :move, presence: true
	validates :uci, presence: true
	validates :fen, presence: true

	# Relationships
	belongs_to :master_game, required: true
end
