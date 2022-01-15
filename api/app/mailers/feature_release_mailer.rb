class FeatureReleaseMailer < ApplicationMailer
	default from: "news@chesshq.com"

	def pgn_import
		enrollments = UserSetting.where(key: "feature_releases", value: "1").all
		recipients  = []

		enrollments.each do |enrollment|
			recipients.push(enrollment.user.email)

			if (recipients.length == 50)
				self.send_pgn_import(recipients)

				recipients = []
			end
		end

		if (recipients.length > 0)
			self.send_pgn_import(recipients)
		end
	end

	private
		def send_pgn_import(recipients)
			mail(bcc: recipients, subject: "Chess HQ: PGN import and arrow saving now available")
		end
end
