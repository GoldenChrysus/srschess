class User < ApplicationRecord
	# Validation
	validates :email, presence: true, uniqueness: {:case_sensitive => false}
	validates :uid, presence: true, uniqueness: true

	# Relationships
	has_many :repertoires, dependent: :destroy
	has_many :collections, dependent: :destroy
	has_many :communication_enrollments, dependent: :destroy

	# Callbacks
	after_validation :normalize_email, on: :create

	def position_count
		params = {
			user_id: self.id
		}
		sql =
			"SELECT
				COUNT(1) AS count
			FROM
				repertoire_moves m
			JOIN
				repertoires r
			ON
				r.id = m.repertoire_id
			WHERE
				r.user_id = :user_id"
		sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
		res = self.class.connection.exec_query(sql)

		return 0 unless res.count > 0
		return res[0]["count"]
	end

	private
		def normalize_email
			self.email.to_s.downcase!
		end
end
