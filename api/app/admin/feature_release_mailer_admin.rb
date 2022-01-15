class FeatureReleaseMailerAdmin
	def self.pgn_import
		enrollments = UserSetting.where(key: "feature_releases", value: "1").all
		recipients  = []

		enrollments.each do |enrollment|
			recipients.push(enrollment.user.email)

			if (recipients.length == 50)
				FeatureReleaseMailer.pgn_import(recipients).deliver

				recipients = []
			end
		end

		if (recipients.length > 0)
			FeatureReleaseMailer.pgn_import(recipients).deliver
		end
	end
end