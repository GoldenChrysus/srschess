class CreateRepertoires < ActiveRecord::Migration[6.1]
  def change
    create_table :repertoires do |t|
      t.string :name, null: false
      t.string :side, null: false

      t.belongs_to :user, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
