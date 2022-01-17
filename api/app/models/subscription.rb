class Subscription < ApplicationRecord
	include Stripe::Callbacks

	# Validation
	validates :customer, presence: true
	validates :price, presence: true

	# Relationships
	belongs_to :customer, required: true
	belongs_to :price, required: true

	# Stripe
	after_customer_subscription_created! do |subscription, event|
		customer = Customer.where(stripe_id: subscription.customer).first
		price    = Price.where(stripe_id: subscription.plan.id).first

		Subscription.create(
			customer: customer,
			price: price,
			stripe_id: subscription.id,
			started_at: Time.at(subscription.start_date)
		)
	end

	after_customer_subscription_deleted! do |subscription, event|
		local_subscription = Subscription.where(stripe_id: subscription.id).first

		if (local_subscription != nil)
			local_subscription.ended_at = Time.at(subscription.ended_at)

			local_subscription.save
		end
	end

	after_customer_subscription_updated! do |subscription, event|
		local_subscription = Subscription.where(stripe_id: subscription.id).first
		price              = Price.where(stripe_id: subscription.plan.id).first

		if (local_subscription != nil)
			local_subscription.ended_at = (subscription.ended_at != nil or subscription.cancel_at != nil) ? Time.at(subscription.ended_at || subscription.cancel_at) : nil
			local_subscription.price    = price

			if (local_subscription.ended_at == nil and subscription.status != "active")
				local_subscription.ended_at = Time.now.utc
			end

			local_subscription.save
		end
	end
end
