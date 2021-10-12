# Internal coding for authentication errors is in the 300100 range
module ApiErrors
	class AuthenticationError < ApiErrors::BaseError
	end
end