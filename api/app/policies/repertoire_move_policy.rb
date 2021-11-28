class RepertoireMovePolicy < ApplicationPolicy
	def show?
		Current.internal_error_code = 100001

		return (record.repertoire.user == user)
	end

	def update?
		Current.internal_error_code = 100002
		show?
	end

	def delete?
		Current.internal_error_code = 100003
		update?
	end
end