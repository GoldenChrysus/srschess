class GameMoveNote < ApplicationRecord
	# Validations
	validates :move, presence: true, uniqueness: true

	# Relationships
	belongs_to :move, class_name: "GameMove", required: true, foreign_key: :game_move_id
end
