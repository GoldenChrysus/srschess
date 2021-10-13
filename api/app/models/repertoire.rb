class Repertoire < ApplicationRecord
	# Attributes
	attr_accessor :lesson_queue_length
	attr_accessor :review_queue_length
	attr_accessor :next_review

	# Validation
	validates :user, presence: true
	validates :name, presence: true
	validates :side, presence: true
	validates :side, inclusion: { in: ->(i) { [ i.side_was ] }}, on: :update
	validates :user_id, inclusion: { in: ->(i) { [ i.user_id_was ] }}, on: :update

	# Types
	enum side: {white: 1, black: 0}, _prefix: true

	# Relationships
	belongs_to :user, required: true
	has_many :moves, -> { order("move_number ASC, sort ASC") }, dependent: :destroy, class_name: "RepertoireMove"

	# Callbacks
	after_validation :set_slug, on: :create

	def next_review
		params = {
			:id => self.id
		}

		sql =
			"SELECT
				MIN(l.next_review) AS next_review
			FROM
				learned_items l
			JOIN
				repertoire_moves m
			ON
				m.id = l.repertoire_move_id
			WHERE
				m.repertoire_id = :id"
		sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
		res = ActiveRecord::Base.connection.exec_query(sql)

		return (res.length) ? res[0]["next_review"] : null
	end

	def lesson_queue_length
		return self.lesson_queue.length
	end

	def review_queue_length
		return self.review_queue.length
	end

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
						repertoire_moves m
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
						repertoire_moves m,
						movetree mt
					WHERE
						m.parent_id = mt.id
				)
			SELECT
				mt.id,
				mt.parent_id,
				mt.move,
				mt.uci,
				ARRAY_TO_JSON(mt.movelist) AS movelist
			FROM
				movetree mt
			JOIN
				repertoires r
			ON
				r.id = mt.repertoire_id
			LEFT JOIN
				learned_items li
			ON
				li.repertoire_move_id = mt.id
			WHERE
				li.id IS NULL AND
				CASE
					WHEN
						r.side = 1
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

	def review_queue
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
						repertoire_moves m
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
						repertoire_moves m,
						movetree mt
					WHERE
						m.parent_id = mt.id
				)
			SELECT
				mt.id,
				mt.parent_id,
				mt.move,
				mt.uci,
				ARRAY_TO_JSON(mt.movelist) AS movelist,
				STRING_AGG(similar_moves.move, ',') AS similar_moves
			FROM
				movetree mt
			JOIN
				repertoires r
			ON
				r.id = mt.repertoire_id
			JOIN
				learned_items li
			ON
				li.repertoire_move_id = mt.id
			LEFT JOIN
				repertoire_moves parent_move
			ON
				parent_move.id = mt.parent_id
			LEFT JOIN
				repertoire_moves fen_parents
			ON
				fen_parents.fen = parent_move.fen
			LEFT JOIN
				repertoire_moves similar_moves
			ON
				CASE
					WHEN
						mt.parent_id IS NULL
					THEN
						similar_moves.parent_id IS NULL AND
						similar_moves.repertoire_id = :repertoire_id AND
						similar_moves.id != mt.id
					ELSE
						similar_moves.parent_id = fen_parents.id AND
						similar_moves.id != mt.id
				END
			WHERE
				li.next_review <= CURRENT_TIMESTAMP AND
				li.level <= 8 AND
				CASE
					WHEN
						r.side = 1
					THEN
						mt.level % 2 = 1
					ELSE
						mt.level % 2 = 0
				END
			GROUP BY
				1,
				2,
				3,
				4,
				mt.movelist,
				mt.path
			ORDER BY
				mt.path ASC; -- depth-first
				-- mt.level ASC, mt.sort ASC; -- breadth-first"

		sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
		
		return ActiveRecord::Base.connection.exec_query(sql)
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
