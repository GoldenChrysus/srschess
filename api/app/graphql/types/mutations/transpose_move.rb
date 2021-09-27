module Types
	module Mutations
		class TransposeMove < BaseMutation
			argument :id, String, required: true
			argument :transposition_id, String, required: true

			field :move, Types::Models::MoveType, null: true
			field :errors, [String], null: false

			def resolve(id:, transposition_id:)
				move = Move.find(id)

				authorize move, :update?

				transposition = Move.find(transposition_id)

				authorize transposition, :update?

				move.transposition = transposition

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