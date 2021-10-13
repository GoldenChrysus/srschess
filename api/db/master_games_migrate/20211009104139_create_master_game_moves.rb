class CreateMasterGameMoves < ActiveRecord::Migration[6.1]
  def change
    create_table :master_game_moves do |t|
      t.belongs_to :master_game, null: false, foreign_key: true, type: :uuid
      t.integer :ply, null: false
      t.string :move, null: false
      t.string :fen, null: false
      t.string :uci, null: false

      t.timestamps
    end
  end
end
