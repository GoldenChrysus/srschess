class ProcessPgnRuby
	include Interactor

	def call
		begin
			games = PGN.parse(context.pgn)

			context.result = games
		rescue
			context.result = false
		end
	end
end