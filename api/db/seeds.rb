# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require "csv"

files = [
	"A", "B", "C", "D", "E"
]

for file in files
	CSV.read(__dir__ + "/data/eco/" + file + ".csv", headers: true, col_sep: "\t").each do |row|
		pgn = PGN::Game.new(row["pgn"].gsub(/[\d]+\. /, "").split)

		moves = []

		for move in pgn.moves
			moves.push(SanitizeSan.call(san: move.to_s).result)
		end

		EcoPosition.update_or_create([{
			code: row["eco"],
			name: row["name"],
			fen: row["epd"],
			pgn: row["pgn"],
			uci: row["uci"],
			movelist: moves.join(".")
		}])
	end
end