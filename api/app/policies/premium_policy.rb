class PremiumPolicy < ApplicationPolicy
	def explore_openings?
		valid = true

		if (!record)
			valid = false
		end

		if (valid)
			fen_parts = record.split(" ")

			move_num  = fen_parts[5].to_i
			move_play = fen_parts[1]

			valid = (move_num < 6 || (move_num == 6 and move_play == "w"))
		end

		if (!valid)
			Current.internal_error_code = 200001
		end

		return valid
	end

	def clone_repertoires?
		valid = (user.repertoires.where(copied_from_public: true).length < 5)

		if (!valid)
			Current.internal_error_code = 200002
		end

		return valid
	end

	def create_collections?
		valid = (user.collections.length < 5)

		if (!valid)
			Current.internal_error_code = 200003
		end

		return valid
	end

	def create_collection_games?
		valid = (record.games.length < 100)

		if (!valid)
			Current.internal_error_code = 200004
		end

		return valid
	end
end