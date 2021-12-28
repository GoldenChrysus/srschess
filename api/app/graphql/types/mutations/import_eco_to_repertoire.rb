module Types
	module Mutations
		class ImportEcoToRepertoire < BaseMutation
			argument :repertoire_id, ID, required: true
			argument :eco_id, ID, required: true
			argument :side, String, required: false

			field :repertoire, Types::Models::RepertoireType, null: true
			field :errors, [String], null: false

			def resolve(repertoire_id:, eco_id:, side:)
				eco = ::EcoPosition.find(eco_id)

				if (repertoire_id == "-1")
					repertoire = ::Repertoire.create(
						user: context[:user],
						name: eco.name,
						side: side,
						public: false
					)
				else
					repertoire = ::Repertoire.find(repertoire_id)
				end

				authorize repertoire, :update?

				file          = Tempfile.new("pgn")
				repertoire_id = repertoire.id.to_s

				begin
					file.write(eco.pgn)
					file.close

					games = ::ProcessPgnPython.call(file: file.path).result

					if (games == false)
						raise ApiErrors::ChessError::InvalidEco.new
					end

					game          = JSON.parse(games)[0]
					move_num      = 10
					previous_move = nil

					game["moves"].each_with_index{|move, i|
						fen     = game["fens"][i]
						move_id = ::RepertoireMove.generateId(repertoire_id, move_num, move, fen)
						exists  = ::RepertoireMove.where({id: move_id}).first

						if (exists != nil)
							move_num += 5

							if (exists.parent != previous_move)
								previous_move.transposition = exists

								previous_move.save
							end

							previous_move = exists

							next
						end

						previous_move = ::RepertoireMove.create(
							id: move_id,
							repertoire: repertoire,
							fen: fen,
							uci: game["ucis"][i],
							move_number: move_num,
							move: move,
							parent: previous_move
						)

						move_num += 5
					}
				ensure
					file.unlink
				end

				if (repertoire.save)
					{
						repertoire: repertoire,
						errors: []
					}
				else
					{
						repertoire: nil,
						errors: repertoire.errors.full_messages
					}
				end
			end
		end
	end
end