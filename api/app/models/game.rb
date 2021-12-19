class Game < ApplicationRecord
	# Validation
	validates :user, presence: true
	validates :user_id, inclusion: { in: ->(i) { [ i.user_id_was ] }}, on: :update

	# Relationships
	belongs_to :user, required: true
	belongs_to :collection
	has_many :moves, -> { order("ply ASC") }, dependent: :destroy, class_name: "GameMove"

	# Types
	enum source: {local: 0, chesscom: 1, lichess: 2}, _prefix: true
end
