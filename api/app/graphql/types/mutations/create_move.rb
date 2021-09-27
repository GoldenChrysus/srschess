module Types
	module Mutations
		class CreateMove < BaseMutation
			argument :id, String, required: true
			argument :repertoire_id, ID, required: true
			argument :fen, String, required: true
			argument :uci, String, required: true
			argument :move_number, Integer, required: true
			argument :move, String, required: true
			argument :parent_id, ID, required: false

			field :move, Types::Models::MoveType, null: true
			field :errors, [String], null: false

			def resolve(id:, repertoire_id:, fen:, uci:, move_number:, move:, parent_id:)
				repertoire = ::Repertoire.find(repertoire_id)

				authorize repertoire, :update?

				parent = if parent_id != nil then Move.find(parent_id) else nil end

				authorize parent, :update? unless parent == nil

				move = ::Move.new(
					id: id,
					repertoire: repertoire,
					fen: fen,
					uci: uci,
					move_number: move_number,
					move: move,
					parent: parent
				)

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