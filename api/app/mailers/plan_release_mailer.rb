class PlanReleaseMailer < ApplicationMailer
	default from: "news@chesshq.com"

	def bishop
		mail(to: "user@example.com", subject: "Chess HQ Bishop Plan Available")
	end
end
