module Types
	module Queries
		class ChessSearch < Types::BaseQuery
			# /chess_search
			class CriteriaItem < Types::BaseInputObject
				argument :movelist, String, required: false
				argument :fen, String, required: false
				argument :eco, String, required: false
				argument :side, String, required: false
			end

			class Criteria < Types::BaseInputObject
				description "Criteria for searching chess repertoires or games"

				argument :mode, String, required: true
				argument :data, CriteriaItem, required: true
			end

			class ResultItem < Types::BaseObject
				field :slug, String, null: false
			end

			type [ResultItem], null: false
			argument :criteria, Criteria, required: true
			
			def resolve(criteria:)
				data = {
					slug: "OK"
				}

				return [data]
			end
		end
	end
end