class PremiumPolicy < ApplicationPolicy
	def explore?
		Current.internal_error_code = 200001

		move_num  = record[5].to_i
		move_play = record[1]

		return (move_num < 6 || (move_num == 6 and move_play == "w"))
	end
end