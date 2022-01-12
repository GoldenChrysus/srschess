class User < ApplicationRecord
	# Validation
	validates :email, presence: true, uniqueness: {:case_sensitive => false}
	validates :uid, presence: true, uniqueness: true

	# Relationships
	has_many :repertoires, dependent: :destroy
	has_many :collections, dependent: :destroy
	has_many :communication_enrollments, dependent: :destroy
	has_one :customer, dependent: :destroy
	has_many :subscriptions, through: :customer

	# Callbacks
	after_validation :normalize_email, on: :create

	def tier
		params = {
			user_id: self.id
		}

		sql =
			"SELECT
				MAX(p.tier) AS tier
			FROM
				customers c
			JOIN
				subscriptions s
			ON
				s.customer_id = c.id
			JOIN
				prices p
			ON
				p.id = s.price_id
			WHERE
				c.user_id = :user_id"

		sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
		res = self.class.connection.exec_query(sql)

		return 0 unless res[0]["tier"] != nil
		return res[0]["tier"].to_i
	end

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

	def repertoire_position_limit # implemented
		tier = self.tier

		return 3500 unless tier > 0
		return 10000 unless tier > 2
		return 30000 unless tier > 4
		return -1
	end

	def repertoire_copy_limit # implemented
		tier = self.tier

		return 5 unless tier > 0
		return 10 unless tier > 2
		return 25 unless tier > 4
		return -1
	end

	def opening_database_limit # implemented
		tier = self.tier

		return 5 unless tier > 0
		return 30 unless tier > 2
		return -1
	end

	def collection_limit # implemented
		tier = self.tier

		return 5 unless tier > 0
		return 100 unless tier > 2
		return 500 unless tier > 4
		return -1
	end

	def collection_game_limit # implemented
		tier = self.tier

		return 100 unless tier > 0
		return 1000 unless tier > 2
		return 2000 unless tier > 4
		return -1
	end

	def database_search_limit # implemented
		tier = self.tier

		return 25 unless tier > 0
		return 100 unless tier > 2
		return 1000
	end

	private
		def normalize_email
			self.email.to_s.downcase!
		end
end
