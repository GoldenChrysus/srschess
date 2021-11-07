module Types
	module Queries
		class FenEco < Types::BaseQuery
			# /fen_eco
			type Types::Models::EcoPositionType, null: false
			argument :fens, [String], required: true
			
			def resolve(fens:)
				lookup = []

				for fen in fens
					valid = ValidateFen.call(fen: fen)

					if (!valid.result)
						raise ApiErrors::ChessError::InvalidFen.new
					end

					lookup.push(fen.split(" ")[0..3].join(" "))
				end

				position = ::EcoPosition.where({ fen: lookup }).order("NLEVEL(movelist) DESC").first

				position
			end
		end
	end
end