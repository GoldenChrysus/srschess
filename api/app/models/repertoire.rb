class Repertoire < ApplicationRecord
	# Attributes
	attr_accessor :lesson_queue_length

	# Validation
	validates :user, presence: true
	validates :name, presence: true
	validates :side, presence: true

	# Types
	enum side: {white: "W", black: "B"}

	# Relationships
	belongs_to :user, required: true
	has_many :moves, -> { order("move_number ASC, sort ASC") }

	# Callbacks
	after_validation :set_slug, on: :create

	def lesson_queue
		params = {
			:repertoire_id => self.id
		}
		sql    =
			"WITH
				RECURSIVE movetree(id, parent_id, repertoire_id, move, uci, sort, level, movelist, path) AS (
					SELECT
						m.id,
						m.parent_id,
						m.repertoire_id,
						m.move,
						m.uci,
						m.sort,
						1,
						ARRAY['', m.move],
						ARRAY[ROW(m.move_number, m.sort)]
					FROM
						moves m
					WHERE
						m.repertoire_id = :repertoire_id AND
						m.parent_id IS NULL
					
					UNION ALL
					
					SELECT
						m.id,
						m.parent_id,
						m.repertoire_id,
						m.move,
						m.uci,
						m.sort,
						level + 1,
						movelist || m.move,
						path || ROW(m.move_number, m.sort)
					FROM
						moves m,
						movetree mt
					WHERE
						m.parent_id = mt.id
				)
			SELECT
				mt.id,
				mt.parent_id,
				mt.move,
				mt.uci,
				array_to_json(mt.movelist) AS movelist
			FROM
				movetree mt
			JOIN
				repertoires r
			ON
				r.id = mt.repertoire_id
			LEFT JOIN
				learned_items li
			ON
				li.move_id = mt.id
			WHERE
				li.id IS NULL AND
				CASE
					WHEN
						r.side = 'W'
					THEN
						mt.level % 2 = 1
					ELSE
						mt.level % 2 = 0
				END
			ORDER BY
				mt.path ASC; -- depth-first
				-- mt.level ASC, mt.sort ASC; -- breadth-first"

		sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
		
		return ActiveRecord::Base.connection.exec_query(sql)
	end

	def lesson_queue_length
		return self.lesson_queue.length
	end

	def self.slug_exists?(slug)
		record = self.where({ slug: slug }).first

		return (record != nil)
	end

	private
		def generate_slug
			nonce_len = 4
			nonce     = Digest::SHA256.hexdigest(SecureRandom.uuid)[0..(nonce_len - 1)]
			
			return (self.name.gsub(/[^A-Za-z\d ]/, "")[0..(255 - nonce_len - 2)] + " " + nonce).gsub(" ", "-").downcase
		end

		def set_slug
			loop do
				self.slug = self.generate_slug()

				break if (!self.class.slug_exists?(self.id))
			end
		end
end
