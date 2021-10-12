require 'rails_helper'

RSpec.describe User, type: :model do
	# Validation tests
	# ensure relevant columns are present before saving
	it { should validate_presence_of(:email) }
	it { should validate_presence_of(:uid) }

	# ensure data is unique
	subject {
		User.create({
			:email => "test@test.com",
			:uid   => "KUPlS6CDVqaSCAXvo9rY"
		})
	}

	it { should validate_uniqueness_of(:email).case_insensitive }
	it { should validate_uniqueness_of(:uid) }

	context "on create" do
		it "should have lowercase email" do
			email = "TEST2@test.com"
			user  = User.create({
				:email => email,
				:uid   => "unique_uid_1"
			})

			expect(user.email).to eq(email.downcase)
		end
	end
end
