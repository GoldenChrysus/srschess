class MasterGamesToCollection < ApplicationRecord
	# Validations
	validates :collection, presence: true
	validates :master_game, presence: true

	# Relationships
	belongs_to :collection, required: true
	belongs_to :master_game, required: true
end
