class MovePolicy < ApplicationPolicy
	def show?
		return (record.repertoire.user == user)
	end

	def update?
		show?
	end
end