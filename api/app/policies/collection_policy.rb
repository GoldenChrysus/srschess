class CollectionPolicy < ApplicationPolicy
	def show?
		return true

		Current.internal_error_code = 100001

		return (record.user == user)
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