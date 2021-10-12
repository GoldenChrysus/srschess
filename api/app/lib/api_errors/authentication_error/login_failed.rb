module ApiErrors
	class AuthenticationError < ApiErrors::BaseError
		class LoginFailed < ApiErrors::AuthenticationError
			def initialize
				Current.internal_error_code = 300101

				super("Login failed. The email or password was incorrect.")
			end
		end
	end
end