FactoryBot.define do
  factory :customer do
    user { nil }
    stripe_id { "MyString" }
  end
end
