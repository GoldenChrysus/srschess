FactoryBot.define do
  factory :error_log do
    user { "" }
    message { "MyString" }
    trace { "MyString" }
    request { "MyString" }
  end
end
