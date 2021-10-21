class ValidateFen
	include Interactor

	def call
		begin
			fen = PGN::FEN.new(context.fen)

			context.result = (fen.to_s == context.fen)
		rescue
			context.result = false
		end
	end
end