SELECT
	UUID_IN(md5(m.fen)::CSTRING) AS fen_uuid,
	ARRAY_AGG(DISTINCT m.master_game_id) AS master_game_ids
FROM
	master_game_moves m
GROUP BY
	1;