class RepertoirePolicy < ApplicationPolicy
	def show?
		return (record.user == user)
	end

	def update?
		show?
	end
end