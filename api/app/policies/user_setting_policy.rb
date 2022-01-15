class UserSettingPolicy < ApplicationPolicy
	def show?
		Current.internal_error_code = 100001
		update?
	end

	def update?
		Current.internal_error_code = 100002

		return (record.user == user)
	end

	def delete?
		Current.internal_error_code = 100003
		update?
	end
end