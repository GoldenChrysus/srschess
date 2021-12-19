module Types
	module Mutations
		class CreateCollectionGames < BaseMutation
			argument :collection_id, ID, required: true
			argument :pgn, String, required: true

			field :games, [Types::Models::GameType], null: true
			field :errors, [String], null: false

			def resolve(collection_id:, pgn:)
				collection = ::Collection.find(collection_id)

				authorize collection, :update?

				data = ProcessPgnRuby.call(pgn: pgn)

				if (data.result == false)
					raise ApiErrors::ChessError::InvalidPgn.new
				end

				games = []

				file = Tempfile.new("pgn")

				begin
					file.write(pgn)
					file.close

					data = ProcessPgnPython.call(file: file.path)

					print(data)

					if (data.result == false)
						raise ApiErrors::ChessError::InvalidPgn.new
					end

					data = JSON.parse(data.result)

					data.each{|game|
						authorize collection, :create_collection_games?, policy_class: PremiumPolicy

						moves = []

						game["moves"].each{|san|
							moves.append(SanitizeSan.call(san: san).result)
						}

						db_game = ::Game.create(
							user: context[:user],
							collection: collection,
							pgn: game["pgn"],
							movelist: moves.join("."),
							source: 0
						)

						games.append(db_game)
					}
				ensure
					file.unlink
				end

				{
					games: games,
					errors: collection.errors.full_messages
				}
			end
		end
	end
end