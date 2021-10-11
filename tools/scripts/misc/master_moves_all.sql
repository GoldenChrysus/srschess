SELECT
	tmp.fen,
	STRING_AGG
		(
			tmp.move || '|' || tmp.white || '|' || tmp.draw || '|' || tmp.black || '|' || tmp.elo,
			';'
			ORDER BY (tmp.white + tmp.draw + tmp.black) DESC
		) AS stats
FROM
	(
		WITH
			games AS (
				SELECT
					m1.fen,
					g.result,
					g.white_elo,
					g.black_elo,
					m2.move
				FROM
					master_games g
				JOIN
					master_game_moves m1
				ON
					m1.master_game_id = g.id
				JOIN
					master_game_moves m2
				ON
					m2.master_game_id = m1.master_game_id AND
					m2.ply = m1.ply + 1
				WHERE
					m1.fen != 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -' AND
					g.white_elo >= 2000 AND
					g.black_elo >= 2000
			),
			first_move AS (
				SELECT
					'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -' AS fen,
					g.result,
					g.white_elo,
					g.black_elo,
					m.move
				FROM
					master_games g
				JOIN
					master_game_moves m
				ON
					m.master_game_id = g.id
				WHERE
					m.ply = 1 AND
					g.white_elo >= 2000 AND
					g.black_elo >= 2000
			)
		SELECT
			g.fen,
			g.move,
			SUM(CASE WHEN g.result = 'W' THEN 1 ELSE 0 END) AS white,
			SUM(CASE WHEN g.result = 'D' THEN 1 ELSE 0 END) AS draw,
			SUM(CASE WHEN g.result = 'B' THEN 1 ELSE 0 END) AS black,
			ROUND(AVG(g.white_elo + g.black_elo) / 2) AS elo
		FROM
			games g
		GROUP BY
			1,
			2

		UNION ALL

		SELECT
			g.fen,
			g.move,
			SUM(CASE WHEN g.result = 'W' THEN 1 ELSE 0 END) AS white,
			SUM(CASE WHEN g.result = 'D' THEN 1 ELSE 0 END) AS draw,
			SUM(CASE WHEN g.result = 'B' THEN 1 ELSE 0 END) AS black,
			ROUND(AVG(g.white_elo + g.black_elo) / 2) AS elo
		FROM
			first_move g
		GROUP BY
			1,
			2
	) tmp
GROUP BY
	tmp.fen
ORDER BY
	SUM(tmp.white + tmp.draw + tmp.black) DESC;


CREATE MATERIALIZED VIEW
	master_move_stats
AS
	(
		SELECT
			tmp.fen,
			STRING_AGG
				(
					tmp.move || '|' || tmp.white || '|' || tmp.draw || '|' || tmp.black || '|' || tmp.elo,
					';'
					ORDER BY (tmp.white + tmp.draw + tmp.black) DESC
				) AS stats
		FROM
			(
				WITH
					games AS (
						SELECT
							m1.fen,
							g.result,
							g.white_elo,
							g.black_elo,
							m2.move
						FROM
							master_games g
						JOIN
							master_game_moves m1
						ON
							m1.master_game_id = g.id
						JOIN
							master_game_moves m2
						ON
							m2.master_game_id = m1.master_game_id AND
							m2.ply = m1.ply + 1
						WHERE
							m1.fen != 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -' AND
							g.white_elo >= 2000 AND
							g.black_elo >= 2000
					),
					first_move AS (
						SELECT
							'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -' AS fen,
							g.result,
							g.white_elo,
							g.black_elo,
							m.move
						FROM
							master_games g
						JOIN
							master_game_moves m
						ON
							m.master_game_id = g.id
						WHERE
							m.ply = 1 AND
							g.white_elo >= 2000 AND
							g.black_elo >= 2000
					)
				SELECT
					g.fen,
					g.move,
					SUM(CASE WHEN g.result = 'W' THEN 1 ELSE 0 END) AS white,
					SUM(CASE WHEN g.result = 'D' THEN 1 ELSE 0 END) AS draw,
					SUM(CASE WHEN g.result = 'B' THEN 1 ELSE 0 END) AS black,
					ROUND(AVG(g.white_elo + g.black_elo) / 2) AS elo
				FROM
					games g
				GROUP BY
					1,
					2

				UNION ALL

				SELECT
					g.fen,
					g.move,
					SUM(CASE WHEN g.result = 'W' THEN 1 ELSE 0 END) AS white,
					SUM(CASE WHEN g.result = 'D' THEN 1 ELSE 0 END) AS draw,
					SUM(CASE WHEN g.result = 'B' THEN 1 ELSE 0 END) AS black,
					ROUND(AVG(g.white_elo + g.black_elo) / 2) AS elo
				FROM
					first_move g
				GROUP BY
					1,
					2
			) tmp
		GROUP BY
			tmp.fen
	);

CREATE UNIQUE INDEX ON master_move_stats (fen);