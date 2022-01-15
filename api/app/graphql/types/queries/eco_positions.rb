module Types
	module Queries
		class EcoPositions < Types::BaseQuery
			class Volume < Types::BaseObject
				field :letter, String, null: false
				field :length, Int, null: false
				field :openings, [Types::Models::EcoPositionType], null: false
			end

			argument :letter, String, required: true
			argument :limit, Int, required: true
			argument :page, Int, required: true
			argument :filter, String, required: false
			argument :movelist, String, required: false

			# /eco_positions
			type [Volume], null: false
			
			def resolve(letter:, limit:, page:, filter:, movelist:)
				letters = (letter == "all") ? ["A", "B", "C", "D", "E"] : [letter]
				volumes = []

				letters.each do |letter|
					params = {}
					where  = []
					joiner = if (letter == "*") then "OR" else "AND" end

					if (letter != "*")
						params[:letter] = letter

						where.push("code LIKE CONCAT(:letter, '%')")
					end

					if (movelist != "" and movelist != nil)
						moves = []

						for move in movelist.split(".")
							moves.push(SanitizeSan.call(san: move.to_s).result)
						end

						params[:movelist] = moves.join(".")

						where.push("movelist ~ CONCAT(:movelist, '.*')::LQUERY")
					end

					if (filter != "" and filter != nil)
						filter.downcase!

						params[:filter_like] = "%#{filter}%"
						params[:filter]      = filter

						where.push(
							"(
								LOWER(CONCAT(code, ': ', name))	LIKE :filter_like OR
								:filter LIKE LOWER(CONCAT('%', fen, '%'))
							)"
						)
					end

					if (where.length == 0)
						where.push("1 = 1")
					end

					where     = where.join(" #{joiner} ")
					positions = ::EcoPosition.where(where, params).order("code ASC, name ASC").all

					volumes.push(
						{
							letter: letter,
							length: positions.length,
							openings: positions.slice((page - 1) * limit, limit) || []
						}
					)
				end

				volumes
			end
		end
	end
end