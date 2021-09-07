class ApplicationController < ActionController::Base
	before_action :set_custom_headers

	protected
		def set_custom_headers
			response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
			response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
		end
end
