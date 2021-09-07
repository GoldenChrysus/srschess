require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Srschess
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
		if (config.public_file_server.headers == nil)
			config.public_file_server.headers = {}
		end

		config.public_file_server.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
		config.public_file_server.headers["Cross-Origin-Opener-Policy"] = "same-origin"
	end
end
