-- INSERT INTO learned_items (move_id, level, created_at, updated_at) VALUES ('d5c4e3b0-0dd0-0008-2bd4-eda7f2550c09', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
WITH
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
			m.repertoire_id = 1 AND
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
	mt.*
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
	mt.level ASC, mt.sort ASC; -- breadth-first