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