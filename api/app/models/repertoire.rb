class Repertoire < ApplicationRecord
	enum side: {white: "W", black: "B"}

	belongs_to :user, required: true
	has_many :moves
end
