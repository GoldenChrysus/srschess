module Types
	module Mutations
		class DeleteRepertoireMove < BaseMutation
			class PreviousMove < Types::BaseObject
				field :id, String, null: false
				field :transposition_id, String, null: true
				field :sort, Int, null: true
			end

			argument :id, String, required: true

			field :repertoire, Types::Models::RepertoireType, null: true
			field :previous_moves, [PreviousMove], null: true
			field :errors, [String], null: false

			def resolve(id:)
				move = ::RepertoireMove.find(id)

				authorize move, :delete?

				repertoire = move.repertoire

				repertoire.user_owned = (context[:user] != nil && repertoire.user.id == context[:user].id)

				previous_moves = []

				repertoire.moves.each do |x|
					previous_moves.append({
						id: x.id,
						transposition_id: x.transposition_id,
						sort: x.sort
					})
				end

				if (move.destroy)
					{
						repertoire: repertoire.reload,
						previous_moves: previous_moves,
						errors: []
					}
				else
					{
						repertoire: nil,
						previous_moves: nil,
						errors: move.errors.full_messages
					}
				end
			end
		end
	end
end