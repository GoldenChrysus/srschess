class UserMailer < ApplicationMailer
	default from: "noreply@chesshq.com"

	def welcome(user)
		mail(to: user.email, subject: "Welcome to your new chess study system")
	end
end
