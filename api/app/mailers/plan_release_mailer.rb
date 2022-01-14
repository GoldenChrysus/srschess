class PlanReleaseMailer < ApplicationMailer
	default from: "news@chesshq.com"

	def bishop
		enrollments = CommunicationEnrollment.where(name: "notify_plan_bishop", sent: false).all
		recipients  = []
		current_ids = []

		enrollments.each do |enrollment|
			current_ids.push(enrollment.id)
			recipients.push(enrollment.user.email)

			if (recipients.length == 50)
				self.send_bishop(recipients, current_ids)

				recipients  = []
				current_ids = []
			end
		end

		if (recipients.length > 0)
			self.send_bishop(recipients, current_ids)
		end
	end

	private
		def send_bishop(recipients, ids)
			mail(bcc: recipients, subject: "Chess HQ Bishop Plan Available")
			CommunicationEnrollment.where(id: ids).update_all(sent: true)
		end
end
