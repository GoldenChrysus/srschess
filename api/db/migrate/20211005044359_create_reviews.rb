class CreateReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :reviews do |t|
      t.belongs_to :learned_item, null: false, foreign_key: true
      t.integer :incorrect_attempts
      t.integer :attempts
      t.float :average_correct_time
      t.float :average_time

      t.timestamps
    end
  end
end
