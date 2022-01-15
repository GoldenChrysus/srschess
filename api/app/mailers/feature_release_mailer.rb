class FeatureReleaseMailer < ApplicationMailer
	default from: "news@chesshq.com"

	def pgn_import(recipients)
		mail(bcc: recipients, subject: "Chess HQ: PGN import and arrow saving now available")
	end
end
