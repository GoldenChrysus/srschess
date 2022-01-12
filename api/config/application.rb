require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ChessHq
	class Application < Rails::Application
		# Initialize configuration defaults for originally generated Rails version.
		config.load_defaults 6.1

		# Configuration for the application, engines, and railties goes here.
		#
		# These settings can be overridden in specific environments using the files
		# in config/environments, which are processed later.
		#
		# config.time_zone = "Central Time (US & Canada)"
		# config.eager_load_paths << Rails.root.join("extras")

		if Rails.env.development?
			config.assets.precompile += [
				"graphql/voyager/rails/application.css",
				"graphql/voyager/rails/application.js",
				"graphql/voyager/rails/voyager.js"
			]
		end

		config.hosts << "api"

		config.stripe.signing_secrets = [ENV.fetch("STRIPE_SIGNING_SECRET")]
	end
end
