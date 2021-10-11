module Types
	module Queries
		class MasterMoves < Types::BaseQuery
			# /master_moves
			type [Types::Models::MasterMoveType], null: true
			argument :fen, String, required: false
			
			def resolve(fen:)
				fen_parts = fen.split(" ")

				# TODO: Validations (depth, position validity)

				fen_1 = fen_parts[0..3].join(" ")

				fen_parts[3] = "-"

				fen_2 = fen_parts[0..3].join(" ")

				params = {
					:fen_1 => fen_1,
					:fen_2 => fen_2
				}
		
				sql  =
					"SELECT
						stats
					FROM
						master_move_stats
					WHERE
						fen = :fen_1 OR
						fen = :fen_2"
				sql  = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
				res  = ActiveRecord::Base.connection.exec_query(sql)
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