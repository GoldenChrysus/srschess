/* Using FEN */
WITH
	games AS (
		SELECT
			g.result,
			g.white_elo,
			g.black_elo,
			m2.move
		FROM
			master_games g
		JOIN
			master_game_moves m1
		ON
			m1.master_game_id = g.id AND
			m1.fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -'
		JOIN
			master_game_moves m2
		ON
			m2.master_game_id = m1.master_game_id AND
			m2.ply = m1.ply + 1
		WHERE
			g.white_elo >= 2000 AND
			g.black_elo >= 2000
	)
SELECT
	g.move,
	SUM(CASE WHEN g.result = 'W' THEN 1 ELSE 0 END) AS white,
	SUM(CASE WHEN g.result = 'D' THEN 1 ELSE 0 END) AS draw,
	SUM(CASE WHEN g.result = 'B' THEN 1 ELSE 0 END) AS black,
	ROUND(AVG(g.white_elo + g.black_elo) / 2) AS elo
FROM
	games g
GROUP BY
	1
ORDER BY
	COUNT(1) DESC;


/* Using LTREE */
sub_where = (move_number >= 0) ? "SUBPATH(movelist, :move_num, 1) = :move AND" : ""
SELECT
	SUBPATH(movelist, :next_move_num, 1) AS move,
	SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) AS white,
	SUM(CASE WHEN result = 'D' THEN 1 ELSE 0 END) AS draw,
	SUM(CASE WHEN result = 'B' THEN 1 ELSE 0 END) AS black,
	ROUND(AVG(white_elo + black_elo) / 2) AS elo
FROM
	master_games g
WHERE
" + sub_where + "
	NLEVEL(movelist) >= :total_moves AND
	white_elo >= 2000 AND
	black_elo >= 2000
GROUP BY
	1
ORDER BY
	COUNT(1) DESC
LIMIT
	10;