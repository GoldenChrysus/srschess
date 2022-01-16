class ValidateMoves
	include Interactor

	def call
		begin
			res = `python3 #{__dir__}/../python/validate_moves.py "#{context.moves}"`
			res = res.strip

			context.result = (res == "False") ? false : true
		rescue
			context.result = false
		end
	end
end