class PremiumPolicy < ApplicationPolicy
	def explore_openings?
		valid = true

		if (!record)
			valid = false
		end

		if (valid)
			limit = user.opening_database_limit			

			if (limit != -1)
				fen_parts = record.split(" ")
				move_num  = fen_parts[5].to_i
				move_play = fen_parts[1]
				limit    += 1
				valid     = (move_num < limit || (move_num == limit and move_play == "w"))
			end
		end

		if (!valid)
			Current.internal_error_code = 200001
		end

		return valid
	end

	def create_repertoire_moves?
		limit = user.repertoire_position_limit
		valid = (limit == -1 or user.position_count < limit)

		if (!valid)
			Current.internal_error_code = 200005
		end

		return valid
	end

	def clone_repertoires?
		limit = user.repertoire_copy_limit
		valid = (limit == -1 or user.repertoires.where(copied_from_public: true).length < limit)

		if (!valid)
			Current.internal_error_code = 200002
		end

		return valid
	end

	def create_collections?
		limit = user.collection_limit
		valid = (limit == -1 or user.collections.length < limit)

		if (!valid)
			Current.internal_error_code = 200003
		end

		return valid
	end

	def create_collection_games?
		limit = user.collection_game_limit
		valid = (limit == -1 or record.games.length < limit)

		if (!valid)
			Current.internal_error_code = 200004
		end

		return valid
	end
end