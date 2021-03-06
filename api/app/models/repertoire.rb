class Repertoire < ApplicationRecord
	# Attributes
	attr_accessor :lesson_queue_length
	attr_accessor :review_queue_length
	attr_accessor :next_review
	attr_accessor :user_owned

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
				fen_parents.fen = parent_move.fen AND
				fen_parents.repertoire_id = r.id
			LEFT JOIN
				repertoire_moves similar_moves
			ON
				CASE
					WHEN
						mt.parent_id IS NULL
					THEN
						similar_moves.parent_id IS NULL AND
						similar_moves.repertoire_id = r.id AND
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

	def duplicate(user)
		repertoire = self.dup

		repertoire.slug               = nil
		repertoire.user               = user
		repertoire.public             = false
		repertoire.copied_from_public = true

		repertoire.save!

		id_map            = {}
		old_id_map        = {}
		parent_map        = {}
		transposition_map = {}

		self.moves.each do |move|
			old_id = move.id

			parent_map[old_id]        = move.parent_id
			transposition_map[old_id] = move.transposition_id

			move = move.dup

			move.repertoire    = repertoire
			move.parent        = nil
			move.transposition = nil

			move.save!

			id_map[move.id]    = old_id
			old_id_map[old_id] = move.id
		end

		repertoire.moves.each do |move|
			id     = move.id
			old_id = id_map[id]

			if parent_map.key?(old_id)
				old_parent_id = parent_map[old_id]
				new_parent_id = old_id_map[old_parent_id]

				move.parent_id = new_parent_id
			end

			if transposition_map.key?(old_id)
				old_transposition_id = transposition_map[old_id]
				new_transposition_id = old_id_map[old_transposition_id]

				move.transposition_id = new_transposition_id
			end

			move.save!
		end

		return repertoire
	end

	def self.slug_exists?(slug)
		return (self.where(slug: slug).length != 0)
	end

	private
		def set_slug
			loop do
				self.slug = GenerateSlug.call(value: self.name).result

				break if (!self.class.slug_exists?(self.slug))
			end
		end
end
