class RepertoirePolicy < ApplicationPolicy
	def show?
		Current.internal_error_code = 100001

		return (record.public or record.user == user)
	end

	def update?
		Current.internal_error_code = 100002

		return (record.user == user)
	end

	def delete?
		Current.internal_error_code = 100003
		update?
	end

	def clone?
		Current.internal_error_code = 100004

		return (record.public and record.user != user)
	end
end