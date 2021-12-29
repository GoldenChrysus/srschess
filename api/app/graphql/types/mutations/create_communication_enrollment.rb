module Types
	module Mutations
		class CreateCommunicationEnrollment < BaseMutation
			argument :name, String, required: true

			field :enrollment, Types::Models::CommunicationEnrollmentType, null: true
			field :errors, [String], null: false

			def resolve(name:)
				if (context[:user] == nil)
					raise ::ApiErrors::AuthenticationError::Unauthorized.new
				end

				enrollment = ::CommunicationEnrollment.where({user: context[:user], name: name}).first

				if (enrollment == nil)
					enrollment = ::CommunicationEnrollment.new(
						name: name,
						user: context[:user]
					)
				end

				if (enrollment.save)
					{
						enrollment: enrollment,
						errors: []
					}
				else
					{
						enrollment: nil,
						errors: enrollment.errors.full_messages
					}
				end
			end
		end
	end
end