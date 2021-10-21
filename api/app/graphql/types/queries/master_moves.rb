module Types
	module Queries
		class MasterMoves < Types::BaseQuery
			# /master_moves
			type [Types::Models::MasterMoveType], null: true
			argument :fen, String, required: false
			
			def resolve(fen:)
				valid = ValidateFen.call(fen: fen)

				if (!valid.result)
					raise ApiErrors::ChessError::InvalidFen.new
				end

				authorize fen, :explore_openings?, policy_class: PremiumPolicy

				params = {
					:fen => fen.split(" ")[0..3].join(" ")
				}
		
				sql  =
					"SELECT
						stats
					FROM
						master_move_stats
					WHERE
						fen = :fen"
				sql  = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
				res  = MasterGame.connection.exec_query(sql)
				data = []

				return nil unless res.count > 0

				res = res[0]["stats"].split(";")

				res.each_with_index do |record, index|
					stats = record.split("|")

					data.push({
						key: index,
						move: stats[0],
						white: stats[1],
						draw: stats[2],
						black: stats[3],
						elo: stats[4]
					})
				end

				data
			end
		end
	end
end