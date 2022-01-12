module Types
	module Queries
		class ChessSearch < Types::BaseQuery
			# /chess_search
			class CriteriaItem < Types::BaseInputObject
				argument :movelist, String, required: false
				argument :fen, String, required: false
				argument :eco, String, required: false
				argument :side, String, required: false
				argument :elo, String, required: false
				argument :elo_comparison, String, required: false
			end

			class Criteria < Types::BaseInputObject
				description "Criteria for searching chess repertoires or games"

				argument :mode, String, required: true
				argument :data, CriteriaItem, required: true
			end

			class ResultItem < Types::BaseObject
				field :slug, String, null: false
				field :name, String, null: false
				field :created_at, String, null: false
				field :move_count, Int, null: true
				field :side, Int, null: true
				field :result, Int, null: true
				field :event, String, null: true
				field :round, String, null: true
			end

			type [ResultItem], null: false
			argument :criteria, Criteria, required: true
			
			def resolve(criteria:)
				user = context[:user]
				data = criteria[:data]

				case criteria[:mode]
					when "repertoires"
						where  = ["r.public = true"]
						params = {}
						skip   = false

						if (data[:movelist] != nil)
							skip = true

							params[:movelist] = data[:movelist]
							params[:length]   = params[:movelist].split(".").length

							where.push(
								"r.id IN
									(
										WITH
											RECURSIVE movetree(id, level, movelist) AS (
												SELECT
													m.id,
													1,
													ARRAY[m.move]
												FROM
													repertoire_moves m
												WHERE
													m.move = ANY(STRING_TO_ARRAY(:movelist, '.')) AND
													m.parent_id IS NULL
												
												UNION ALL
												
												SELECT
													m.id,
													level + 1,
													movelist || m.move
												FROM
													repertoire_moves m,
													movetree mt
												WHERE
													m.parent_id = mt.id AND
													m.move = ANY(STRING_TO_ARRAY(:movelist, '.'))
											)
										SELECT
											r.id
										FROM
											movetree mt
										JOIN
											repertoire_moves m
										ON
											mt.id = m.id
										JOIN
											repertoires r
										ON
											r.id = m.repertoire_id
										WHERE
											mt.level = :length AND
											ARRAY_TO_STRING(mt.movelist, '.') = :movelist
									)"
							)
						end

						if (!skip and data[:fen].to_s != "")
							valid = ValidateFen.call(fen: data[:fen])

							if (!valid.result)
								raise ApiErrors::ChessError::InvalidFen.new
							end

							where.push(
								"EXISTS
									(
										SELECT
											1
										FROM
											repertoire_moves m2
										WHERE
											m2.repertoire_id = r.id AND
											m2.fen = :fen
										LIMIT
											1
									)"
							)

							params[:fen] = data[:fen]
						end

						if (!skip and data[:eco].to_s != "")
							where.push(
								"EXISTS
									(
										SELECT
											1
										FROM
											repertoire_moves m3
										JOIN
											eco_positions p
										ON
											p.fen = TRIM(SUBSTRING(m3.fen FROM '^(([^ ]* ){4})'))
										WHERE
											p.id = :eco_id
										LIMIT
											1
									)"
							)

							params[:eco_id] = data[:eco]
						end

						if (!skip and data[:side].to_s != "")
							where.push("r.side = :side")

							params[:side] = ::Repertoire.sides[data[:side]]
						end

						where = where.join(" AND ")
						sql   =
							"SELECT
								r.slug,
								r.name,
								r.created_at,
								r.side,
								COUNT(m.*) AS move_count
							FROM
								repertoires r
							JOIN
								repertoire_moves m
							ON
								m.repertoire_id = r.id AND
								ABS((MOD(m.move_number, 2)) - 1) = r.side
							WHERE
								#{where}
							GROUP BY
								r.slug,
								r.name,
								r.created_at,
								r.side"
						sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
						res = ::Repertoire.connection.exec_query(sql)

						return [] unless res.count > 0
						return res

					when "master_games"
						where = [
							"g.white != '?'",
							"g.black != '?'",
							"g.year IS NOT NULL"
						]
						joins            = []
						params           = {}
						skip             = false
						limit            = (user != nil) ? user.database_search_limit : 5
						valid_comparison = {
							"lte" => "<=",
							"gte" => ">=",
							"eq"  => "="
						}

						if (data[:movelist] != nil and data[:movelist] != "")
							skip  = true
							moves = []

							for move in data[:movelist].split(".")
								moves.push(SanitizeSan.call(san: move.to_s).result)
							end

							params[:movelist] = moves.join(".")

							where.push("g.movelist ~ CONCAT(:movelist, '.*')::LQUERY")
						end

						if (!skip and data[:elo].to_s != "" and data[:elo].to_i > 0 and valid_comparison.key?(data[:elo_comparison]))
							params[:elo] = data[:elo].to_i.to_s

							comparison = valid_comparison[data[:elo_comparison]]

							where.push("
								(
									g.white_elo #{comparison} :elo OR
									g.black_elo #{comparison} :elo
								)
							")
						end

						if (!skip and data[:eco].to_s != "")
							begin
								eco = ::EcoPosition.find(data[:eco])
							rescue
								raise ApiErrors::ChessError::InvalidEco.new
							end

							params[:eco_fen] = eco.fen

							joins.push(
								"JOIN
									fen_master_games fg1
								ON
									fg1.fen_uuid = UUID_IN(md5(:eco_fen)::CSTRING) AND
									g.id = ANY(fg1.master_game_ids)"
							)
						end

						if (!skip and data[:fen].to_s != "")
							valid = ValidateFen.call(fen: data[:fen])

							if (!valid.result)
								raise ApiErrors::ChessError::InvalidFen.new
							end

							params[:fen] = data[:fen].split(" ").slice(0..3).join(" ")

							joins.push(
								"JOIN
									fen_master_games fg2
								ON
									fg2.fen_uuid = UUID_IN(md5(:fen)::CSTRING) AND
									g.id = ANY(fg2.master_game_ids)"
							)
						end

						joins = joins.join(" ")
						where = where.join(" AND ")
						sql   =
							"SELECT
								g.id AS slug,
								CONCAT(white, ' - ', black) AS name,
								CONCAT(year, '-', LPAD(COALESCE(month::VARCHAR, '??'), 2, '0'), '-', LPAD(COALESCE(day::VARCHAR, '??'), 2, '0')) AS created_at,
								g.result,
								g.event,
								g.round
							FROM
								master_games g
							#{joins}
							WHERE
								#{where}
							LIMIT
								#{limit}"
						sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
						res = ::MasterGame.connection.exec_query(sql)

						return [] unless res.count > 0
						return res
				end
			end
		end
	end
end