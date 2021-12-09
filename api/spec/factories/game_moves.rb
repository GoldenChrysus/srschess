FactoryBot.define do
  factory :game_move do
    game { nil }
    ply { 1 }
    move { "MyString" }
    fen { "MyString" }
    uci { "MyString" }
  end
end
