module Types
	module Queries
		class EcoTranspositions < Types::BaseQuery
			class Result < Types::BaseObject
				field :length, Int, null: false
				field :openings, [Types::Models::EcoPositionType], null: false
			end

			argument :limit, Int, required: true
			argument :page, Int, required: true
			argument :movelist, String, required: false

			# /eco_positions
			type Result, null: false
			
			def resolve(limit:, page:, movelist:)
				data = {
					length: 0,
					openings: []
				}

				if (movelist.to_s == "")
					return data
				end

				moves = {
					white: [],
					black: []
				}
				params = {}
				where  = []

				movelist.split(".").each_with_index do |move, index|
					move = SanitizeSan.call(san: move.to_s).result
					key  = if (index % 2 == 0) then :white else :black end

					moves[key].push(move)
				end

				[:white, :black].each do |side|
					if (moves[side].length > 0)
						moves[side].each_with_index do |move, index|
							key = side.to_s + "_" + index.to_s

							params[key.to_sym] = "*.#{move}.*"

							where.push("movelist ~ :#{key}::LQUERY")
						end
					end
				end

				where     = where.join(" AND ")
				positions = ::EcoPosition.where(where, params).order("code ASC, name ASC").all
				results   = []
				moves     = movelist.split(".")

				positions.each do |position|
					pos_moves = position.pgn.gsub(/\d+\. /, "").split(" ")
					swaps     = {}
					valid     = true

					moves.each_with_index do |move, index|
						pos_index = pos_moves.index(move)

						if (pos_index == nil)
							valid = false

							break
						elsif (pos_index != index)
							swaps[pos_index] = index
						end
					end

					next unless valid == true

					pos_moves = position.uci.split(" ")
					new_moves = pos_moves.dup

					swaps.each do |pos_index, index|
						new_moves[pos_index] = pos_moves[index]
						new_moves[index]     = pos_moves[pos_index]
					end

					game = Chess::Game.new()

					begin
						pos_moves.each do |move|
							game.half_move move
						end
					rescue
						next
					end

					results.push(position)
				end

				data[:length]   = results.length
				data[:openings] = results.slice((page - 1) * limit, limit)

				data
			end
		end
	end
end