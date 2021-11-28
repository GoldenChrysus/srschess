module Types
	module Mutations
		class CloneRepertoire < BaseMutation
			argument :id, ID, required: true

			field :repertoire, Types::Models::RepertoireType, null: true
			field :errors, [String], null: false

			def resolve(id:)
				repertoire = ::Repertoire.find(id)

				authorize repertoire, :clone?
				authorize nil, :clone_repertoires?, policy_class: PremiumPolicy

				new_repertoire = repertoire.duplicate(context[:user])

				if (new_repertoire != nil)
					{
						repertoire: new_repertoire,
						errors: []
					}
				else
					{
						repertoire: nil,
						errors: repertoire.errors.full_messages
					}
				end
			end
		end
	end
end