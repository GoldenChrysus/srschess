module Types
	module Queries
		class MasterGame < Types::BaseQuery
			# /master_game
			type Types::Models::MasterGameType, null: false
			argument :id, String, required: true
			
			def resolve(id:)
				begin
					::MasterGame.find(id)
				rescue
					return nil
				end
			end
		end
	end
end