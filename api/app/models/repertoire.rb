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

	def lesson_queue
		params = {
			:repertoire_id => self.id
		}
		sql    =
			"WITH
				RECURSIVE movetree(id, move, uci, sort, level, movelist, path) AS (
					SELECT
						m.id,
						m.move,
						m.uci,
						m.sort,
						1,
						ARRAY[m.move],
						ARRAY[ROW(m.move_number, m.sort)]
					FROM
						moves m
					WHERE
						m.repertoire_id = :repertoire_id AND
						m.parent_id IS NULL
					
					UNION ALL
					
					SELECT
						m.id,
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
				mt.move,
				mt.uci,
				array_to_json(mt.movelist) AS movelist
			FROM
				movetree mt
			LEFT JOIN
				learned_items li
			ON
				li.move_id = mt.id
			WHERE
				li.id IS NULL
			ORDER BY
				-- mt.path ASC; -- depth-first
				mt.level ASC, mt.sort ASC; -- breadth-first"

		sql = ActiveRecord::Base.sanitize_sql_array([sql, params].flatten)
		
		return ActiveRecord::Base.connection.exec_query(sql)
	end

	def lesson_queue_length
		return self.lesson_queue.length
	end
end
