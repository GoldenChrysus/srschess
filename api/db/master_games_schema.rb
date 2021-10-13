# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_10_12_085511) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "ltree"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "master_game_moves", force: :cascade do |t|
    t.uuid "master_game_id", null: false
    t.integer "ply", null: false
    t.string "move", null: false
    t.string "fen", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "uci"
    t.index ["fen"], name: "index_master_game_moves_on_fen"
    t.index ["master_game_id", "ply"], name: "index_master_game_moves_on_master_game_id_and_ply", unique: true
    t.index ["master_game_id"], name: "index_master_game_moves_on_master_game_id"
    t.index ["ply"], name: "index_master_game_moves_on_ply"
  end

  create_table "master_games", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "white", null: false
    t.string "black", null: false
    t.integer "white_elo"
    t.integer "black_elo"
    t.integer "year"
    t.integer "month"
    t.integer "day"
    t.string "eco"
    t.text "pgn", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.ltree "movelist", null: false
    t.string "location"
    t.string "white_fide_id"
    t.string "white_title"
    t.string "black_fide_id"
    t.string "black_title"
    t.string "event"
    t.string "round"
    t.integer "source", null: false
    t.integer "result", null: false
  end

  add_foreign_key "master_game_moves", "master_games"
end
