module ApiErrors
	module LoggedError
		def initialize(message)
			super(message)

			@should_log = true
		end
	end
end