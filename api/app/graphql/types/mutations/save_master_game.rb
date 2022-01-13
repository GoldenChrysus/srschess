module Types
	module Mutations
		class SaveMasterGame < BaseMutation
			argument :game_id, ID, required: true
			argument :collection_id, ID, required: true

			field :collection, Types::Models::CollectionType, null: true
			field :errors, [String], null: false

			def resolve(game_id:, collection_id:)
				game       = MasterGame.find(game_id)
				collection = Collection.find(collection_id)

				authorize collection, :update?
				authorize collection, :create_collection_games?, policy_class: PremiumPolicy

				year  = (game.year == nil or game.year == 0) ? "????" : game.year.to_s
				month = (game.month == nil or game.month == 0) ? "??" : game.month.to_s.rjust(2, "0")
				day   = (game.day == nil or game.day == 0) ? "??" : game.day.to_s.rjust(2, "0")
				date  = "#{year}-#{month}-#{day}"

				collection_game = ::Game.create(
					user: context[:user],
					collection: collection,
					pgn: game.pgn,
					movelist: game.movelist,
					source: "master_games",
					date: date,
					white: game.white,
					black: game.black,
					event: game.event,
					round: game.round,
					result: MasterGame.results[game.result]
				)

				if (collection_game.save)
					collection.reload

					collection.user_owned = (context[:user] != nil && collection.user.id == context[:user].id)

					{
						collection: collection,
						errors: []
					}
				else
					{
						collection: nil,
						errors: collection_game.errors.full_messages
					}
				end
			end
		end
	end
end