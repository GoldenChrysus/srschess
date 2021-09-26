module Types
	module Mutations
		class TransposeMove < BaseMutation
			argument :id, String, required: true
			argument :transposition_id, String, required: true

			field :move, Types::Models::MoveType, null: true
			field :errors, [String], null: false

			def resolve(id:, transposition_id:)
				move = Move.find(id)

				move.transposition = Move.find(transposition_id)

				if (move.save)
					{
						move: move,
						errors: []
					}
				else
					{
						move: nil,
						errors: move.errors.full_messages
					}
				end
			end
		end
	end
end