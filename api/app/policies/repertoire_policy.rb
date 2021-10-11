class RepertoirePolicy < ApplicationPolicy
	def show?
		Current.internal_error_code = 100001

		return (record.user == user)
	end

	def update?
		Current.internal_error_code = 100002
		show?
	end
end