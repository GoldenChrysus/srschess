class GenerateSlug
	include Interactor

	def call
		nonce_len = 4
		nonce     = Digest::SHA256.hexdigest(SecureRandom.uuid)[0..(nonce_len - 1)]
		
		context.result = (context.value.gsub(/[^A-Za-z\d \-]/, "")[0..(255 - nonce_len - 2)] + " " + nonce).gsub(" ", "-").downcase
	end
end