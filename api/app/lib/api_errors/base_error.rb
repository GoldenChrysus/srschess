module ApiErrors
	class BaseError < StandardError
		def initialize(message)
			super(message)

			@should_log = false
		end

		def should_log
			@should_log
		end
	end
end