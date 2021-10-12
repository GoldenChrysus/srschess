class ValidateFen
	include Interactor

	def call
		begin
			fen = PGN::FEN.new(context.fen)

			original_fen = fen.to_s
			final_fen    = fen.to_position.to_fen.to_s

			context.result = (final_fen == context.fen or original_fen == context.fen)
			context.fen_1  = final_fen
			context.fen_2  = original_fen
		rescue
			context.result = false
		end
	end
end