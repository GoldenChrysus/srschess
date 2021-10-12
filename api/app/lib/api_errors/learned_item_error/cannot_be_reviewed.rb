module ApiErrors
	class LearnedItemError < ApiErrors::BaseError
		class CannotBeReviewed < ApiErrors::LearnedItemError
			def initialize
				Current.internal_error_code = 300201

				super("This move cannot be reviewed yet.")
			end
		end
	end
end