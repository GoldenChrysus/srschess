require 'rails_helper'

RSpec.describe "MasterMoves query" do
	user = User.create({
		email: "mastermoves@test.com",
		uid: "master_moves_1"
	})
	query = "query MasterMoves($fen: String) {
		masterMoves(fen: $fen) {
			key
			move
			white
			draw
			black
			elo
			__typename
		}
	}"
	context = {
		user: user
	}
	op_name = "MasterMoves"

	it "raises a premium access error" do
		variables = {
			"fen" => "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 6"
		}

		expect {
			SrschessSchema.execute(query, variables: variables, context: context, operation_name: op_name)
		}.to raise_error(Pundit::NotAuthorizedError)
	end

	it "raises a FEN validation error" do
		variables = {
			"fen" => "rnbqkb1r/pppp1ppp/4pPP/RNBQKBNR b KQkq - 0 6"
		}

		expect {
			SrschessSchema.execute(query, variables: variables, context: context, operation_name: op_name)
		}.to raise_error(ApiErrors::ChessError::InvalidFen)
	end
end