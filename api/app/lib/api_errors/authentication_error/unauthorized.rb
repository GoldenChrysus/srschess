module ApiErrors
	class AuthenticationError < ApiErrors::BaseError
		class Unauthorized < ApiErrors::AuthenticationError
			def initialize
				super("Not authorized to access this resource.")
			end
		end
	end
end