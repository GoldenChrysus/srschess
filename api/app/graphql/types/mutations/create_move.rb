module Types
	module Mutations
		class CreateMove < BaseMutation
			argument :id, String, required: true
			argument :repertoire_id, ID, required: true
			argument :fen, String, required: true
			argument :move_number, Integer, required: true
			argument :move, String, required: true
			argument :sort, Integer, required: true
			argument :parent_id, ID, required: false

			field :move, Types::Models::MoveType, null: true
			field :errors, [String], null: false

			def resolve(id:, repertoire_id:, fen:, move_number:, move:, sort:, parent_id:)
				move = Move.new(
					id: id,
					repertoire: Repertoire.find(repertoire_id),
					fen: fen,
					move_number: move_number,
					move: move,
					sort: sort,
					parent: if parent_id != nil then Move.find(parent_id) else nil end
				)

				if (move.save)
					{
						move: move,
						errors: []
					}
				else
					puts move.errors
					{
						move: nil,
						errors: move.errors.full_messages
					}
				end
			end
		end
	end
end