class ValidateFen
	include Interactor

	def call
		res = `python3 #{__dir__}/../python/validate_fen.py "#{context.fen}"`

		context.result = (res.strip == "True")
	end
end