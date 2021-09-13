module ApiErrors
	class AuthenticationError < ApiErrors::BaseError
		class LoginFailed < ApiErrors::AuthenticationError
			def initialize
				super("Login failed. The email or password was incorrect.")
			end
		end
	end
end