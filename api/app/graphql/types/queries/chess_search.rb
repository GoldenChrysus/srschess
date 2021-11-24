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
			end

			type [ResultItem], null: false
			argument :criteria, Criteria, required: true
			
			def resolve(criteria:)
				case criteria[:mode]
					when "repertoires"
						where  = ["r.public = true"]
						params = {}

						if (criteria[:data][:fen].to_s != "")
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

						if (criteria[:data][:eco].to_s != "")
						end

						if (criteria[:data][:side].to_s != "")
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
				end
			end
		end
	end
end