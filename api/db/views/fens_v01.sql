SELECT DISTINCT
	UUID_IN(md5(m.fen)::CSTRING) AS id,
	m.fen
FROM
	master_game_moves m;