module Types
	module Mutations
		class CreateRepertoireMoveArrowDatum < BaseMutation
			argument :move_id, ID, required: true
			argument :data, [String], required: false

			field :move, Types::Models::RepertoireMoveType, null: true
			field :errors, [String], null: false

			def resolve(move_id:, data:)
				move = ::RepertoireMove.find(move_id)

				authorize move, :update?

				arrow = move.arrow

				if (arrow == nil)
					arrow = ::RepertoireMoveArrowDatum.new(move: move)
				end

				arrow.data = data

				if (arrow.save)
					move.reload

					{
						move: move,
						errors: []
					}
				else
					{
						move: nil,
						errors: arrow.errors.full_messages
					}
				end
			end
		end
	end
end