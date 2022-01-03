SELECT
	m.fen,
	ARRAY_AGG(m.master_game_id) AS master_game_ids
FROM
	master_game_moves m
GROUP BY
	m.fen;