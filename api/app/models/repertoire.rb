class Repertoire < ApplicationRecord
	# Validation
	validates :user, presence: true
	validates :name, presence: true
	validates :side, presence: true

	# Types
	enum side: {white: "W", black: "B"}

	# Relationships
	belongs_to :user, required: true
	has_many :moves, -> { order("move_number ASC, sort ASC") }
end
