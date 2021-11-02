class SanitizeSan
	include Interactor

	def call
		context.result = context.san.gsub("=", "_").gsub(/[^A-Za-z\d_]/, "")
	end
end