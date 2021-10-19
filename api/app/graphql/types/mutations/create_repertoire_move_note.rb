module Types
	module Mutations
		class CreateRepertoireMoveNote < BaseMutation
			argument :move_id, ID, required: true
			argument :value, String, required: false

			field :note, Types::Models::RepertoireMoveNoteType, null: true
			field :errors, [String], null: false

			def resolve(move_id:, value:)
				move = ::RepertoireMove.find(move_id)

				authorize move, :update?

				note = move.note

				if (note == nil)
					note = ::RepertoireMoveNote.new(move: move)
				end

				note.value = value

				if (note.save)
					{
						note: note,
						errors: []
					}
				else
					{
						note: nil,
						errors: note.errors.full_messages
					}
				end
			end
		end
	end
end