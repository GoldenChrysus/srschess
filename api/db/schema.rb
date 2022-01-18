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

ActiveRecord::Schema.define(version: 2022_01_17_114446) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "ltree"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "collections", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug", null: false
    t.index ["slug"], name: "index_collections_on_slug", unique: true
    t.index ["user_id"], name: "index_collections_on_user_id"
  end

  create_table "communication_enrollments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "sent", default: false
    t.index ["user_id"], name: "index_communication_enrollments_on_user_id"
  end

  create_table "customers", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "stripe_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["stripe_id"], name: "index_customers_on_stripe_id", unique: true
    t.index ["user_id"], name: "index_customers_on_user_id", unique: true
  end

  create_table "eco_positions", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.string "fen", null: false
    t.text "pgn", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.ltree "movelist", null: false
    t.string "slug", null: false
    t.string "uci"
    t.index ["code", "fen"], name: "index_eco_positions_on_code_and_fen", unique: true
    t.index ["fen"], name: "index_eco_positions_on_fen", unique: true
    t.index ["movelist"], name: "index_eco_positions_on_movelist", using: :gist
    t.index ["pgn"], name: "index_eco_positions_on_pgn", unique: true
    t.index ["slug"], name: "index_eco_positions_on_slug", unique: true
  end

  create_table "error_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.string "message"
    t.string "trace"
    t.string "request"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_error_logs_on_user_id"
  end

  create_table "game_move_notes", force: :cascade do |t|
    t.bigint "game_move_id", null: false
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_move_id"], name: "index_game_move_notes_on_game_move_id", unique: true
  end

  create_table "game_moves", force: :cascade do |t|
    t.bigint "game_id", null: false
    t.integer "ply", null: false
    t.string "move", null: false
    t.string "fen", null: false
    t.string "uci"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_id"], name: "index_game_moves_on_game_id"
  end

  create_table "games", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "date"
    t.text "pgn", null: false
    t.ltree "movelist", null: false
    t.integer "source", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "collection_id"
    t.string "event"
    t.string "round"
    t.string "white"
    t.string "black"
    t.integer "result"
    t.string "source_id"
    t.index ["collection_id", "source", "source_id"], name: "index_games_on_collection_id_source_source_id", unique: true, where: "(source_id IS NOT NULL)"
    t.index ["collection_id"], name: "index_games_on_collection_id"
    t.index ["user_id"], name: "index_games_on_user_id"
  end

  create_table "learned_items", force: :cascade do |t|
    t.uuid "repertoire_move_id", null: false
    t.integer "level"
    t.datetime "next_review"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["repertoire_move_id"], name: "index_learned_items_on_repertoire_move_id", unique: true
  end

  create_table "master_games_to_collections", force: :cascade do |t|
    t.bigint "collection_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "master_game_id", null: false
    t.index ["collection_id", "master_game_id"], name: "idx_master_games_to_collections_on_collection_and_master_game", unique: true
    t.index ["collection_id"], name: "index_master_games_to_collections_on_collection_id"
    t.index ["master_game_id"], name: "index_master_games_to_collections_on_master_game_id"
  end

  create_table "prices", id: :string, force: :cascade do |t|
    t.string "stripe_id", null: false
    t.integer "tier", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["stripe_id"], name: "index_prices_on_stripe_id", unique: true
    t.index ["tier"], name: "index_prices_on_tier", unique: true
  end

  create_table "repertoire_move_arrow_data", id: :bigint, default: -> { "nextval('repertoire_move_arrow_datum_id_seq'::regclass)" }, force: :cascade do |t|
    t.uuid "repertoire_move_id", null: false
    t.string "data", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["repertoire_move_id"], name: "index_repertoire_move_arrow_datum_on_repertoire_move_id", unique: true
  end

  create_table "repertoire_move_notes", force: :cascade do |t|
    t.uuid "repertoire_move_id", null: false
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["repertoire_move_id"], name: "index_repertoire_move_notes_on_repertoire_move_id", unique: true
  end

  create_table "repertoire_moves", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "move_number", null: false
    t.string "move", null: false
    t.text "fen", null: false
    t.integer "sort", null: false
    t.bigint "repertoire_id", null: false
    t.uuid "parent_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "uci", null: false
    t.uuid "transposition_id"
    t.index ["parent_id"], name: "index_repertoire_moves_on_parent_id"
    t.index ["repertoire_id", "move_number", "move", "fen"], name: "repertoire_moves_uniqueness_index", unique: true
    t.index ["repertoire_id"], name: "index_repertoire_moves_on_repertoire_id"
    t.index ["transposition_id"], name: "index_repertoire_moves_on_transposition_id"
  end

  create_table "repertoires", force: :cascade do |t|
    t.string "name", null: false
    t.integer "side", limit: 2, null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug"
    t.boolean "public", default: false, null: false
    t.boolean "copied_from_public", default: false, null: false
    t.index ["side"], name: "index_repertoires_on_side"
    t.index ["user_id"], name: "index_repertoires_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "learned_item_id", null: false
    t.integer "incorrect_attempts"
    t.integer "attempts"
    t.float "average_correct_time"
    t.float "average_time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["learned_item_id"], name: "index_reviews_on_learned_item_id"
  end

  create_table "setting_categories", force: :cascade do |t|
    t.integer "key", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["key"], name: "index_setting_categories_on_key", unique: true
  end

  create_table "subscriptions", force: :cascade do |t|
    t.string "stripe_id", null: false
    t.bigint "customer_id", null: false
    t.string "price_id", null: false
    t.datetime "started_at", null: false
    t.datetime "ended_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_subscriptions_on_customer_id"
    t.index ["price_id"], name: "index_subscriptions_on_price_id"
    t.index ["stripe_id"], name: "index_subscriptions_on_stripe_id", unique: true
  end

  create_table "user_settings", force: :cascade do |t|
    t.bigint "setting_category_id", null: false
    t.bigint "user_id", null: false
    t.string "key", null: false
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["setting_category_id"], name: "index_user_settings_on_setting_category_id"
    t.index ["user_id", "key"], name: "index_user_settings_on_user_id_and_key", unique: true
    t.index ["user_id"], name: "index_user_settings_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "uid", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "collections", "users"
  add_foreign_key "communication_enrollments", "users"
  add_foreign_key "customers", "users"
  add_foreign_key "game_move_notes", "game_moves"
  add_foreign_key "game_moves", "games"
  add_foreign_key "games", "users"
  add_foreign_key "learned_items", "repertoire_moves"
  add_foreign_key "master_games_to_collections", "collections"
  add_foreign_key "repertoire_move_arrow_data", "repertoire_moves"
  add_foreign_key "repertoire_move_notes", "repertoire_moves"
  add_foreign_key "repertoire_moves", "repertoire_moves", column: "parent_id"
  add_foreign_key "repertoire_moves", "repertoire_moves", column: "transposition_id"
  add_foreign_key "repertoire_moves", "repertoires"
  add_foreign_key "repertoires", "users"
  add_foreign_key "reviews", "learned_items"
  add_foreign_key "subscriptions", "customers"
  add_foreign_key "subscriptions", "prices"
  add_foreign_key "user_settings", "setting_categories"
  add_foreign_key "user_settings", "users"
end
