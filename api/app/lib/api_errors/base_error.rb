module ApiErrors
	class BaseError < StandardError
		def initialize(message)
			super(message)
		end
	end
end