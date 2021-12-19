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

					if (data.result == false)
						raise ApiErrors::ChessError::InvalidPgn.new
					end

					data    = JSON.parse(data.result)
					results = [
						"1-0",
						"0-1",
						"1/2-1/2"
					]

					data.each{|game|
						authorize collection, :create_collection_games?, policy_class: PremiumPolicy

						moves = []

						game["moves"].each{|san|
							moves.append(SanitizeSan.call(san: san).result)
						}

						date = game["date"]

						if (date == nil)
							date = "????-??-??"
						else
							date = date.split("T")[0].gsub(".", "-")

							if (!/([\d]{4}|\?{4})-([\d]{2}|\?{2})-([\d]{2}|\?{2})/.match(date))
								date = nil
							end
						end

						db_game = ::Game.create(
							user: context[:user],
							collection: collection,
							pgn: game["pgn"],
							movelist: moves.join("."),
							source: "local",
							date: date,
							white: game["white"],
							black: game["black"],
							event: game["event"],
							round: game["round"],
							result: (results.include?(game["result"])) ? game["result"] : nil
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