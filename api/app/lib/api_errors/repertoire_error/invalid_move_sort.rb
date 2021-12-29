module ApiErrors
	class RepertoireError < ApiErrors::BaseError
		class InvalidMoveSort < ApiErrors::ChessError
			def initialize
				Current.internal_error_code = 300401

				super("Invalid move sort.")
			end
		end
	end
end