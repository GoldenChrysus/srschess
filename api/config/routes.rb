Rails.application.routes.draw do
	root to: proc { [404, {}, ["Not found."]] }

	namespace "api" do
	end
end