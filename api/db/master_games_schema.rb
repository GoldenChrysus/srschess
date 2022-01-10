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

ActiveRecord::Schema.define(version: 2022_01_03_081108) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "ltree"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "unaccent"

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
    t.index ["black"], name: "index_master_games_on_black"
    t.index ["black_elo"], name: "index_master_games_on_black_elo"
    t.index ["black_title"], name: "index_master_games_on_black_title"
    t.index ["day"], name: "index_master_games_on_day"
    t.index ["eco"], name: "index_master_games_on_eco"
    t.index ["month"], name: "index_master_games_on_month"
    t.index ["movelist"], name: "index_master_games_on_movelist", using: :gist
    t.index ["result"], name: "index_master_games_on_result"
    t.index ["white"], name: "index_master_games_on_white"
    t.index ["white_elo"], name: "index_master_games_on_white_elo"
    t.index ["white_title"], name: "index_master_games_on_white_title"
    t.index ["year"], name: "index_master_games_on_year"
  end

  add_foreign_key "master_game_moves", "master_games"

  create_view "master_game_names", materialized: true, sql_definition: <<-SQL
      SELECT g.id AS master_game_id,
      1 AS side,
      get_searchable_names(g.white) AS names
     FROM master_games g
  UNION
   SELECT g.id AS master_game_id,
      0 AS side,
      get_searchable_names(g.black) AS names
     FROM master_games g;
  SQL
  add_index "master_game_names", ["master_game_id", "side"], name: "index_master_game_names_on_master_game_id_and_side", unique: true

  create_view "master_move_stats", materialized: true, sql_definition: <<-SQL
      SELECT uuid_in((md5((tmp.fen)::text))::cstring) AS fen_uuid,
      string_agg((((((((((tmp.move)::text || '|'::text) || tmp.white) || '|'::text) || tmp.draw) || '|'::text) || tmp.black) || '|'::text) || tmp.elo), ';'::text ORDER BY ((tmp.white + tmp.draw) + tmp.black) DESC) AS stats
     FROM ( WITH games AS (
                   SELECT m1.fen,
                      g.result,
                      g.white_elo,
                      g.black_elo,
                      m2.move
                     FROM ((master_games g
                       JOIN master_game_moves m1 ON ((m1.master_game_id = g.id)))
                       JOIN master_game_moves m2 ON (((m2.master_game_id = m1.master_game_id) AND (m2.ply = (m1.ply + 1)))))
                    WHERE (((m1.fen)::text <> 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'::text) AND (g.white_elo >= 2000) AND (g.black_elo >= 2000))
                  ), first_move AS (
                   SELECT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'::text AS fen,
                      g.result,
                      g.white_elo,
                      g.black_elo,
                      m.move
                     FROM (master_games g
                       JOIN master_game_moves m ON ((m.master_game_id = g.id)))
                    WHERE ((m.ply = 1) AND (g.white_elo >= 2000) AND (g.black_elo >= 2000))
                  )
           SELECT g.fen,
              g.move,
              sum(
                  CASE
                      WHEN (g.result = 1) THEN 1
                      ELSE 0
                  END) AS white,
              sum(
                  CASE
                      WHEN (g.result = 2) THEN 1
                      ELSE 0
                  END) AS draw,
              sum(
                  CASE
                      WHEN (g.result = 0) THEN 1
                      ELSE 0
                  END) AS black,
              round((avg((g.white_elo + g.black_elo)) / (2)::numeric)) AS elo
             FROM games g
            GROUP BY g.fen, g.move
          UNION ALL
           SELECT g.fen,
              g.move,
              sum(
                  CASE
                      WHEN (g.result = 1) THEN 1
                      ELSE 0
                  END) AS white,
              sum(
                  CASE
                      WHEN (g.result = 2) THEN 1
                      ELSE 0
                  END) AS draw,
              sum(
                  CASE
                      WHEN (g.result = 0) THEN 1
                      ELSE 0
                  END) AS black,
              round((avg((g.white_elo + g.black_elo)) / (2)::numeric)) AS elo
             FROM first_move g
            GROUP BY g.fen, g.move) tmp
    GROUP BY (uuid_in((md5((tmp.fen)::text))::cstring));
  SQL
  add_index "master_move_stats", ["fen_uuid"], name: "index_master_move_stats_on_fen_uuid", unique: true

  create_view "fen_master_games", materialized: true, sql_definition: <<-SQL
      SELECT uuid_in((md5((m.fen)::text))::cstring) AS fen_uuid,
      array_agg(DISTINCT m.master_game_id) AS master_game_ids
     FROM master_game_moves m
    GROUP BY (uuid_in((md5((m.fen)::text))::cstring));
  SQL
  add_index "fen_master_games", ["fen_uuid"], name: "index_fen_master_games_on_fen_uuid", unique: true

end
