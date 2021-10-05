module ApiErrors
	class LearnedItemError < ApiErrors::BaseError
		class CannotBeReviewed < ApiErrors::LearnedItemError
			def initialize
				super("This move cannot be reviewed yet.")
			end
		end
	end
end