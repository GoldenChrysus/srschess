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
		
	end
end
