module ApiErrors
	class ChessError < ApiErrors::BaseError
		class InvalidPgn < ApiErrors::ChessError
			def initialize
				Current.internal_error_code = 300303

				super("Invalid PGN provided.")
			end
		end
	end
end