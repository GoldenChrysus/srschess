class AlterCommunicationEnrollments < ActiveRecord::Migration[6.1]
	def change
		add_column :communication_enrollments, :sent, :boolean, default: false
	end
end
