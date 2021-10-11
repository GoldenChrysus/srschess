class GraphqlChannel < ApplicationCable::Channel
	include ::Secured
	include Pundit
	# If accessing from outside this domain, nullify the session
	# This allows for outside API access while preventing CSRF attacks,
	# but you'll have to authenticate your user separately
	# protect_from_forgery with: :null_session

	def execute(data)
		variables = prepare_variables(data["variables"])
		query = data["query"]
		operation_name = data["operationName"]
		context = {
			channel: self,
			user: @current_user
		}
		result = SrschessSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
		transmit({ 
			:result => result
		})
	rescue Pundit::NotAuthorizedError => e
		handle_error_in_development(e)
	rescue StandardError => e
		raise e unless Rails.env.development?
		handle_error_in_development(e)
	end

	private

	# Handle variables in form data, JSON body, or a blank value
	def prepare_variables(variables_param)
		case variables_param
		when String
			if variables_param.present?
				JSON.parse(variables_param) || {}
			else
				{}
			end
		when Hash
			variables_param
		when ActionController::Parameters
			variables_param.to_unsafe_hash # GraphQL-Ruby will validate name and type of incoming variables.
		when nil
			{}
		else
			raise ArgumentError, "Unexpected parameter: #{variables_param}"
		end
	end

	def handle_error_in_development(e)
		logger.error e.message
		logger.error e.backtrace.join("\n")

		transmit({
			:result => {
				errors: [
					{
						message: e.message,
						backtrace: e.backtrace,
						code: Current.internal_error_code
					}
				]
			}
		})
	end
end
