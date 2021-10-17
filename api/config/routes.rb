Rails.application.routes.draw do
	root to: proc { [404, {}, ["Not found."]] }

	get "/health", to: proc { [200, {}, ["healthy\n"]] }

	mount ActionCable.server => "/cable"

	post "/graphql", to: "graphql#execute"

	if Rails.env.development?
		mount GraphiQL::Rails::Engine, at: "/gql", graphql_path: "graphql#execute"
		mount Graphql::Voyager::Rails::Engine, at: "/voyager", graphql_path: "/graphql"
	end
end