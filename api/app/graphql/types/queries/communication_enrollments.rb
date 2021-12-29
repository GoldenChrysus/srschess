module Types
	module Queries
		class CommunicationEnrollments < Types::BaseQuery
			# /communication_enrollments
			type [Types::Models::CommunicationEnrollmentType], null: false
			
			def resolve
				return [] unless context[:user] != nil
				context[:user].communication_enrollments
			end
		end
	end
end