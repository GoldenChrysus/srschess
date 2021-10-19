class RepertoireMoveNote < ApplicationRecord
	# Validations
	validates :move, presence: true, uniqueness: true

	# Relationships
	belongs_to :move, class_name: "RepertoireMove", required: true, foreign_key: :repertoire_move_id
end
