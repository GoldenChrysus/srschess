module Secured
	extend ActiveSupport::Concern

	included do
		before_subscribe :authenticate_request!
	end

	private
		def authenticate_request!
			token = params[:token]

			decode(token)
		end

		def decode(token)
			decoded = JWT.decode(
				token,
				nil,
				false,
				algorithms: "RS256",
				iss: "https://securetoken.google.com/" + ENV["firebase_project_id"],
				verify_iss: true,
				aud: ENV["firebase_project_id"],
				verify_aud: true
			)

			uid  = decoded[0]["sub"]
			user = User.where({ uid: uid }).first

			@current_user = user
		end
end