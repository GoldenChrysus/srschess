FactoryBot.define do
  factory :user_setting do
    setting_category { nil }
    user { nil }
    value { "MyString" }
  end
end
