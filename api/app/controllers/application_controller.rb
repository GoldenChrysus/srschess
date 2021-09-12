class ApplicationController < ActionController::Base
	# include JSONAPI::ActsAsResourceController
	include Pundit

	protect_from_forgery with: :null_session
	before_action :set_custom_headers

	protected
		def set_custom_headers
			response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
			response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
		end
end
