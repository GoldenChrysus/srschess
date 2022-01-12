module Types
	module Mutations
		class CreateCheckout < BaseMutation
			argument :price, String, required: true

			class Session < Types::BaseObject
				field :id, String, null: false
				field :url, String, null: false
			end

			field :session, Session, null: true

			def resolve(price:)
				user = context[:user]

				raise ApiErrors::AuthenticationError::Unauthorized.new unless user != nil and user.tier == 0

				customer = user.customer

				if (customer == nil)
					stripe_customer = Stripe::Customer.create({
						email: user.email
					})

					customer = ::Customer.create(
						user: user,
						stripe_id: stripe_customer.id
					)
				end

				stripe_session = Stripe::Checkout::Session.create({
					cancel_url: ENV["REACT_APP_PUBLIC_URL"] + "/upgrade",
					success_url: ENV["REACT_APP_PUBLIC_URL"] + "/upgrade",
					mode: "subscription",
					customer: customer.stripe_id,
					line_items: [
						{
							price: ("Stripe::Prices::" + price.upcase).constantize.stripe_id,
							quantity: 1
						}
					]
				})

				{
					session: {
						id: stripe_session.id,
						url: stripe_session.url
					}
				}
			end
		end
	end
end