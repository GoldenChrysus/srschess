class PlanReleaseMailer < ApplicationMailer
	default from: "news@chesshq.com"

	def bishop(recipients, ids)
		mail(bcc: recipients, subject: "Chess HQ Bishop Plan Available")
		CommunicationEnrollment.where(id: ids).update_all(sent: true)
	end

	def rook(recipients, ids)
		mail(bcc: recipients, subject: "Chess HQ Rook Plan Available")
		CommunicationEnrollment.where(id: ids).update_all(sent: true)
	end
end
