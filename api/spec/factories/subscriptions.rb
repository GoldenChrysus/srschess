FactoryBot.define do
  factory :subscription do
    customer { nil }
    type { "" }
    started_at { "2022-01-12 22:21:00" }
    ended_at { "2022-01-12 22:21:00" }
  end
end
