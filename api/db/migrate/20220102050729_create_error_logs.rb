class CreateErrorLogs < ActiveRecord::Migration[6.1]
	def change
		create_table :error_logs do |t|
			t.belongs_to :user
			t.string :message
			t.string :trace
			t.string :request

			t.timestamps
		end
	end
end
