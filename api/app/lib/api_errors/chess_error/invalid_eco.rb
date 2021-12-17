module ApiErrors
	class ChessError < ApiErrors::BaseError
		class InvalidEco < ApiErrors::ChessError
			def initialize
				Current.internal_error_code = 300302

				super("Invalid ECO provided.")
			end
		end
	end
end