class AddMoveUniqueIndex < ActiveRecord::Migration[6.1]
  def change
    add_index :moves, [:repertoire_id, :move_number, :move], :unique => true
  end
end
