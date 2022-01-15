module Types
	module Mutations
		class ImportRepertoireMoves < BaseMutation
			argument :repertoire_id, ID, required: true
			argument :pgn, String, required: true
			argument :replace, Boolean, required: true

			field :repertoire, Types::Models::RepertoireType, null: true

			def resolve(repertoire_id:, pgn:, replace:)
				repertoire = ::Repertoire.find(repertoire_id)

				authorize repertoire, :update?

				file       = Tempfile.new("pgn")
				move_cache = {}

				begin
					file.write(pgn)
					file.close

					data = ImportRepertoirePgn.call(repertoire_id: repertoire.id, file: file.path)

					if (data.result == false)
						raise ApiErrors::ChessError::InvalidPgn.new
					end

					data = JSON.parse(data.result)

					data.each do |key, move|
						db_move = ::RepertoireMove.where(id: move["id"]).first

						if (db_move == nil)
							authorize nil, :create_repertoire_moves?, policy_class: PremiumPolicy

							db_move = ::RepertoireMove.new
						elsif (db_move != nil and replace == false)
							authorize db_move, :update?

							move_cache[db_move.id] = db_move

							next
						else
							authorize db_move, :update?
						end

						db_move.repertoire    = repertoire
						db_move.move_number   = move["move_number"]
						db_move.move          = move["move"]
						db_move.uci           = move["uci"]
						db_move.fen           = move["fen"]
						db_move.parent        = if move["parent_id"] != nil then move_cache[move["parent_id"]] else nil end
						db_move.transposition = if move["transposition_id"] != nil then move_cache[move["transposition_id"]] else nil end

						db_move.save

						if (move["note"] != nil)
							note = db_move.note

							if (note == nil)
								note = ::RepertoireMoveNote.new
							end

							note.move  = db_move
							note.value = move["note"]

							note.save
						end

						if (move["arrow"] != nil)
							arrow = db_move.arrow

							if (arrow == nil)
								arrow = ::RepertoireMoveArrowDatum.new
							end

							arrow.move = db_move
							arrow.data = move["arrow"]

							arrow.save
						end

						move_cache[db_move.id] = db_move
					end
				ensure
					file.unlink
				end

				repertoire.reload

				repertoire.user_owned = (context[:user] != nil && repertoire.user.id == context[:user].id)

				{
					repertoire: repertoire
				}
			end
		end
	end
end