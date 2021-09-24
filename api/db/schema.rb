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

ActiveRecord::Schema.define(version: 2021_09_24_131214) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "ltree"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

# Could not dump table "master_games" because of following StandardError
#   Unknown type 'game_source' for column 'source'

  create_table "moves", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "move_number", null: false
    t.string "move", null: false
    t.text "fen", null: false
    t.integer "sort", null: false
    t.bigint "repertoire_id", null: false
    t.uuid "parent_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "uci", null: false
    t.index ["parent_id"], name: "index_moves_on_parent_id"
    t.index ["repertoire_id", "move_number", "move", "fen"], name: "index_moves_on_repertoire_id_and_move_number_and_move_and_fen", unique: true
    t.index ["repertoire_id"], name: "index_moves_on_repertoire_id"
  end

# Could not dump table "repertoires" because of following StandardError
#   Unknown type 'side' for column 'side'

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password"
    t.string "bearer", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "moves", "moves", column: "parent_id"
  add_foreign_key "moves", "repertoires"
  add_foreign_key "repertoires", "users"
end
