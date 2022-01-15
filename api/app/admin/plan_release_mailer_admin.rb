class PlanReleaseMailerAdmin < ApplicationMailer

	def self.bishop
		enrollments = CommunicationEnrollment.where(name: "notify_plan_bishop", sent: false).all
		recipients  = []
		current_ids = []

		enrollments.each do |enrollment|
			current_ids.push(enrollment.id)
			recipients.push(enrollment.user.email)

			if (recipients.length == 50)
				PlanReleaseMailer.send_bishop(recipients, current_ids).deliver

				recipients  = []
				current_ids = []
			end
		end

		if (recipients.length > 0)
			PlanReleaseMailer.send_bishop(recipients, current_ids).deliver
		end
	end
end
