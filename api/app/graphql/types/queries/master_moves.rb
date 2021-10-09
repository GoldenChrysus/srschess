module Types
	module Queries
		class MasterMoves < Types::BaseQuery
			# /master_moves
			type [Types::Models::MasterMoveType], null: true
			argument :move, String, required: false
			argument :move_number, Integer, required: true
			
			def resolve(move:, move_number:)
				params = {
					:move          => move,
					:move_num      => move_number,
					:next_move_num => move_number + 1,
					:total_moves   => move_number + 2
				}

				sub_where = (move_number >= 0) ? "SUBPATH(movelist, :move_num, 1) = :move AND" : ""
		
				sql =
					"SELECT
						ROW_NUMBER() OVER (PARTITION BY NULL) AS \"key\",
						tmp.*
					FROM
						(
							SELECT
								SUBPATH(movelist, :next_move_num, 1) AS move,
								SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) AS white,
								SUM(CASE WHEN result = 'D' THEN 1 ELSE 0 END) AS draw,
								SUM(CASE WHEN result = 'B' THEN 1 ELSE 0 END) AS black,
								ROUND(AVG(white_elo + black_elo) / 2) AS elo
							FROM
								master_games g
							WHERE
							" + sub_where + "
								NLEVEL(movelist) >= :total_moves AND
								white_elo >= 2000 AND
								black_elo >= 2000
							GROUP BY
								1
							ORDER BY
								COUNT(1) DESC
							LIMIT
								10
						) tmp"
				sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
				res = ActiveRecord::Base.connection.exec_query(sql)

				res
			end
		end
	end
end