module Types
	module Mutations
		class CreateReview < BaseMutation
			argument :move_id, ID, required: true
			argument :incorrect_attempts, Integer, required: true
			argument :attempts, Integer, required: true
			argument :average_correct_time, Float, required: true
			argument :average_time, Float, required: true

			field :learned_item, Types::Models::LearnedItemType, null: true
			field :errors, [String], null: false

			def resolve(move_id:, incorrect_attempts:, attempts:, average_correct_time:, average_time:)
				move = Move.find(move_id)

				authorize move, :update?

				learned = LearnedItem.where({ move: move }).first
				is_new  = (learned == nil)
				record  = nil

				if (learned == nil)
					learned = LearnedItem.new(move: move)
				else
					learned.complete_review({
						incorrect_attempts: incorrect_attempts,
						attempts: attempts,
						average_correct_time: average_correct_time,
						average_time: average_time
					})
				end

				if (learned.save)
					{
						learned_item: learned,
						errors: []
					}
				else
					{
						learned_item: nil,
						errors: learned.errors.full_messages
					}
				end
			end
		end
	end
end