class LearnedItem < ApplicationRecord
	# Class constants
	LevelMap = {
		1 => "4 hours",
		2 => "8 hours",
		3 => "1 days",
		4 => "2 days",
		5 => "4 days",
		6 => "2 weeks",
		7 => "1 months",
		8 => "4 months",
		9 => "99 years"
	}

	# Validations
	validates :level, presence: true
	validates :move, presence: true, uniqueness: true

	# Relationships
	belongs_to :move, class_name: "RepertoireMove", required: true, foreign_key: "repertoire_move_id"
	has_many :reviews, dependent: :destroy

	# Callbacks
	before_validation :set_initial_data, on: :create

	def complete_review(data)
		incorrect_attempts = data[:incorrect_attempts]
		current_level      = self.level
		new_level          = 1

		if (current_level === 9 || Time.now < self.next_review)
			raise ApiErrors::LearnedItemError::CannotBeReviewed.new
		end

		if (incorrect_attempts === 0)
			new_level = current_level + 1
		elsif (current_level > 1)
			penalty    = (current_level >= 5) ? 2 : 1
			adjustment = ((incorrect_attempts / 2.0).to_f).ceil
			new_level  = [current_level - (adjustment * penalty), 1].max
		end

		self.level       = new_level
		self.next_review = get_next_review_date(new_level)

		self.save

		review_data = {
			:learned_item         => self,
			:incorrect_attempts   => incorrect_attempts,
			:attempts             => data[:attempts],
			:average_correct_time => data[:average_correct_time].to_f.round,
			:average_time         => data[:average_time].to_f.round
		}

		Review.create(review_data)
		return self
	end

	private
		def get_next_review_date(level)
			advance  = {}
			map_item = self.class::LevelMap[level].split(" ")

			advance[map_item[1].to_sym] = map_item[0].to_i

			return Time.now.advance(advance).beginning_of_hour
		end

		def set_initial_data
			self.level       = 1
			self.next_review = get_next_review_date(self.level)
		end
end