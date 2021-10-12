module ApiErrors
	class ChessError < ApiErrors::BaseError
		class InvalidFen < ApiErrors::ChessError
			def initialize
				Current.internal_error_code = 300301

				super("Invalid FEN provided.")
			end
		end
	end
end