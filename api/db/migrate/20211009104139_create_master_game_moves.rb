class CreateMasterGameMoves < ActiveRecord::Migration[6.1]
  def change
    create_table :master_game_moves do |t|
      t.belongs_to :master_game, null: false, foreign_key: true, type: :uuid
      t.integer :ply
      t.string :move
      t.string :fen

      t.timestamps
    end
  end
end
