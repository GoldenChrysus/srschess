class Customer < ApplicationRecord
	# Validation
	validates :user, presence: true, uniqueness: true
	validates :stripe_id, presence: true, uniqueness: true

	# Relationships
	belongs_to :user, required: true
	has_many :subscriptions, dependent: :destroy
end
