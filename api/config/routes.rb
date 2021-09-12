Rails.application.routes.draw do
	root to: proc { [404, {}, ["Not found."]] }

	namespace "api" do
		jsonapi_resources :users
		jsonapi_resources :repertoires
		jsonapi_resources :moves
	end

	post "/graphql", to: "graphql#execute"

	if Rails.env.development?
		mount GraphiQL::Rails::Engine, at: "/gql", graphql_path: "graphql#execute"
	end
end