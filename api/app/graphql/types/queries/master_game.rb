module Types
	module Queries
		class MasterGame < Types::BaseQuery
			# /master_game
			type Types::Models::MasterGameType, null: false
			argument :id, String, required: true
			
			def resolve(id:)
				::MasterGame.find(id)
			end
		end
	end
end