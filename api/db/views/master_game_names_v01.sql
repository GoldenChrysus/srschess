SELECT
	g.id AS master_game_id,
	1 AS side,
	GET_SEARCHABLE_NAMES(white) AS names
FROM
	master_games g

UNION

SELECT
	g.id AS master_game_id,
	0 AS side,
	GET_SEARCHABLE_NAMES(black) AS names
FROM
	master_games g;