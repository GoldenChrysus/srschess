module Types
	module Mutations
		class ReorderRepertoireMove < BaseMutation
			argument :id, String, required: true
			argument :direction, String, required: false

			field :move, Types::Models::RepertoireMoveType, null: true
			field :errors, [String], null: false

			def resolve(id:, direction:)
				move = ::RepertoireMove.find(id)

				authorize move, :update?

				# TODO: handle invalid directions (not in [up, down] or "down" when sort is 0 or "up" when sort is max for tier)
				if ((direction == "up" and move.sort == 0) or (direction == "down" and move.sort_is_max?))
					raise ApiErrors::RepertoireError::InvalidMoveSort.new
				end

				move.setSort(if direction == "up" then move.sort - 1 elsif direction == "down" then move.sort + 1 else move.sort end)

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