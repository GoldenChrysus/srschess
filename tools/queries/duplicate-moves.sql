WITH
	duplicates AS (
		SELECT
			m2.id,
			ROW_NUMBER() OVER (PARTITION BY m2.ply) AS num
		FROM
			master_game_moves m1
		JOIN
			master_game_moves m2
		ON
			m2.master_game_id = m1.master_game_id AND
			m2.ply = m1.ply AND
			m2.id != m1.id
	)
DELETE FROM
	master_game_moves
USING
	duplicates d
WHERE
	d.id = master_game_moves.id AND
	d.num != 1;