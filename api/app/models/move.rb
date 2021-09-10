class Move < ApplicationRecord
	belongs_to :repertoire, required: true
	has_many :moves
end
