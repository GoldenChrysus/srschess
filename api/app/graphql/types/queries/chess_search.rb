module Types
	module Queries
		class ChessSearch < Types::BaseQuery
			# /chess_search
			class CriteriaItem < Types::BaseInputObject
				argument :movelist, String, required: false
				argument :fen, String, required: false
				argument :eco, String, required: false
				argument :side, String, required: false
			end

			class Criteria < Types::BaseInputObject
				description "Criteria for searching chess repertoires or games"

				argument :mode, String, required: true
				argument :data, CriteriaItem, required: true
			end

			class ResultItem < Types::BaseObject
				field :slug, String, null: false
				field :name, String, null: false
				field :created_at, GraphQL::Types::ISO8601DateTime, null: false
				field :move_count, Int, null: true
				field :result, Int, null: true
			end

			type [ResultItem], null: false
			argument :criteria, Criteria, required: true
			
			def resolve(criteria:)
				case criteria[:mode]
					when "repertoires"
						where  = ["r.public = true"]
						params = {}
						skip   = false

						if (criteria[:data][:movelist] != nil)
							skip = true

							params[:movelist] = criteria[:data][:movelist]
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

						if (!skip and criteria[:data][:fen].to_s != "")
							valid = ValidateFen.call(fen: criteria[:data][:fen])

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

							params[:fen] = criteria[:data][:fen]
						end

						if (!skip and criteria[:data][:eco].to_s != "")
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

							params[:eco_id] = criteria[:data][:eco]
						end

						if (!skip and criteria[:data][:side].to_s != "")
							where.push("r.side = :side")

							params[:side] = ::Repertoire.sides[criteria[:data][:side]]
						end

						where = where.join(" AND ")
						sql   =
							"SELECT
								r.slug,
								r.name,
								r.created_at,
								COUNT(m.*) AS move_count
							FROM
								repertoires r
							JOIN
								repertoire_moves m
							ON
								m.repertoire_id = r.id
							WHERE
								#{where}
							GROUP BY
								r.slug,
								r.name,
								r.created_at"
						sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
						res = ::Repertoire.connection.exec_query(sql)

						return [] unless res.count > 0
						return res

					when "master_games"
						where  = [
							"g.white != '?'",
							"g.black != '?'",
							"g.year IS NOT NULL"
						]
						params = {}
						skip   = false

						if (criteria[:data][:movelist] != nil)
							skip  = true
							moves = []

							for move in criteria[:data][:movelist].split(".")
								moves.push(SanitizeSan.call(san: move.to_s).result)
							end

							params[:movelist] = moves.join(".")

							where.push("g.movelist ~ CONCAT(:movelist, '.*')::LQUERY")
						end

						if (!skip and criteria[:data][:eco].to_s != "")
							eco = ::EcoPosition.find(criteria[:data][:eco])

							if (eco == nil)
								raise ApiErrors::ChessError::InvalidEco.new
							end

							where.push(
								"EXISTS
									(
										SELECT
											1
										FROM
											master_game_moves m2
										WHERE
											m2.master_game_id = g.id AND
											m2.fen = :eco_fen
										LIMIT
											1
									)"
							)

							params[:eco_fen] = eco.fen
						end

						if (!skip and criteria[:data][:fen].to_s != "")
							valid = ValidateFen.call(fen: criteria[:data][:fen])

							if (!valid.result)
								raise ApiErrors::ChessError::InvalidFen.new
							end

							where.push(
								"EXISTS
									(
										SELECT
											1
										FROM
											master_game_moves m2
										WHERE
											m2.master_game_id = g.id AND
											m2.fen = TRIM(SUBSTRING(:fen FROM '^(([^ ]* ){4})'))
										LIMIT
											1
									)"
							)

							params[:fen] = criteria[:data][:fen]
						end

						where = where.join(" AND ")
						sql   =
							"SELECT
								g.id AS slug,
								CONCAT(white, ' - ', black) AS name,
								CONCAT(year, '-', COALESCE(month, '01'), '-', COALESCE(day, '01')) AS created_at,
								g.result
							FROM
								master_games g
							WHERE
								#{where}
							LIMIT
								500"
						sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
						res = ::MasterGame.connection.exec_query(sql)

						return [] unless res.count > 0
						return res
				end
			end
		end
	end
end