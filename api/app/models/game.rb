class Game < ApplicationRecord
	# Attributes
	attr_accessor :name

	# Validation
	validates :user, presence: true
	validates :user_id, inclusion: { in: ->(i) { [ i.user_id_was ] }}, on: :update

	# Relationships
	belongs_to :user, required: true
	belongs_to :collection
	has_many :moves, -> { order("ply ASC") }, dependent: :destroy, class_name: "GameMove"

	# Types
	enum source: {local: 0, chesscom: 1, lichess: 2, master_games: 3}, _prefix: true
	enum result: {"0-1": 0, "1-0": 1, "1/2-1/2": 2}, _prefix: true

	def name
		white = self.white ||= "N/A"
		black = self.black ||= "N/A"

		white + " - " + black
	end
end
