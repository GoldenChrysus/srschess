module ApiErrors
	class AuthenticationError < ApiErrors::BaseError
		class Unauthorized < ApiErrors::AuthenticationError
			def initialize
				Current.internal_error_code = 300102

				super("Not authorized to access this resource.")
			end
		end
	end
end