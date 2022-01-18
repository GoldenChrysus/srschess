module Types
	module Mutations
		class ImportExternalGames < BaseMutation
			class ExternalGameData < Types::BaseInputObject
				description "External game data"

				argument :source, String, required: true
				argument :source_id, String, required: true
				argument :pgn, String, required: true
			end

			argument :collection_id, ID, required: true
			argument :games, [ExternalGameData], required: true

			field :games, [Types::Models::GameType], null: true
			field :errors, [String], null: false

			def resolve(collection_id:, games:)
				collection = ::Collection.find(collection_id)

				authorize collection, :update?

				save_games = []

				games.each do |game_data|
					pgn  = game_data[:pgn]
					data = ProcessPgnRuby.call(pgn: pgn)

					if (data.result == false)
						raise ApiErrors::ChessError::InvalidPgn.new
					end

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
							exists = ::Game.where(collection: collection, source: game_data[:source], source_id: game_data[:source_id]).first

							break unless exists == nil

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

							begin
								db_game = ::Game.create(
									user: context[:user],
									collection: collection,
									pgn: game["pgn"],
									movelist: moves.join("."),
									source: game_data[:source],
									source_id: game_data[:source_id],
									date: date,
									white: game["white"],
									black: game["black"],
									event: game["event"],
									round: game["round"],
									result: (results.include?(game["result"])) ? game["result"] : nil
								)

								save_games.append(db_game)
							rescue PG::UniqueViolation
							end
							break
						}
					ensure
						file.unlink
					end
				end

				{
					games: save_games,
					errors: collection.errors.full_messages
				}
			end
		end
	end
end