class Game < ApplicationRecord
	# Validation
	validates :user, presence: true
	validates :user_id, inclusion: { in: ->(i) { [ i.user_id_was ] }}, on: :update

	# Relationships
	belongs_to :user, required: true
	has_many :moves, -> { order("ply ASC") }, dependent: :destroy, class_name: "GameMove"
end
