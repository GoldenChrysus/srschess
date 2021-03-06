class GraphqlChannel < ApplicationCable::Channel
	include ::Secured
	include Pundit
	# If accessing from outside this domain, nullify the session
	# This allows for outside API access while preventing CSRF attacks,
	# but you'll have to authenticate your user separately
	# protect_from_forgery with: :null_session

	def execute(data)
		@data = data

		variables      = prepare_variables(data["variables"])
		query          = data["query"]
		operation_name = data["operationName"]
		context        = {
			channel: self,
			user: @current_user
		}

		result = ChessHqSchema.execute(query, variables: variables, context: context, operation_name: operation_name)

		transmit({ 
			:result => result
		})
	rescue Pundit::NotAuthorizedError => e
		handle_error(e)
	rescue StandardError => e
		handle_error(e)
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

	def handle_error(e)
		if (Rails.env.development?)
			logger.error e.message
			logger.error e.backtrace.join("\n")
		end

		begin
			::ErrorLog.create(
				user: @current_user,
				message: e.message,
				trace: e.backtrace,
				request: @data.to_s
			)
		rescue
			# Couldn't log
		end

		transmit({
			:result => {
				errors: [
					{
						message: e.message,
						backtrace: e.backtrace,
						extensions: {
							code: Current.internal_error_code
						}
					}
				]
			}
		})
	end
end
