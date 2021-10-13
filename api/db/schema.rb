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
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "learned_items", force: :cascade do |t|
    t.uuid "repertoire_move_id", null: false
    t.integer "level"
    t.datetime "next_review"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["repertoire_move_id"], name: "index_learned_items_on_repertoire_move_id"
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

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "uid", null: false
  end

  add_foreign_key "learned_items", "repertoire_moves"
  add_foreign_key "repertoire_moves", "repertoire_moves", column: "parent_id"
  add_foreign_key "repertoire_moves", "repertoire_moves", column: "transposition_id"
  add_foreign_key "repertoire_moves", "repertoires"
  add_foreign_key "repertoires", "users"
  add_foreign_key "reviews", "learned_items"
end
