module Types
	module Mutations
		class CreateRepertoire < BaseMutation
			argument :name, String, required: true
			argument :side, String, required: true
			argument :public, Boolean, required: true

			field :repertoire, Types::Models::RepertoireType, null: true
			field :errors, [String], null: false

			def resolve(name:, side:, public:)
				repertoire = Repertoire.new(
					name: name,
					side: side,
					public: public,
					user: context[:user]
				)

				if (repertoire.save)
					{
						repertoire: repertoire,
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