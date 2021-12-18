-- http://sqlfiddle.com/#!17/3f7ee/7
-- https://www.postgresql.org/docs/13/ltree.html
-- https://dbdiagram.io/d/6136d415825b5b0146f5d60c

-- Schema
CREATE TABLE moves (
	movelist LTREE,
	sort INT
);

SET max_stack_depth TO '3584 kB';
CREATE INDEX movelist_gist_idx ON moves USING GIST (movelist);
CREATE INDEX movelist_idx ON moves USING BTREE (movelist);

-- Data
INSERT INTO
	moves
		(movelist, sort)
VALUES
	('e4', 1),
	('e4.e5', 2),
	('e4.c5', 1),
	('e4.e5.Nf3', 1),
	('e4.e5.Nf3.Nf6', 1),
	('e4.e5.Nf3.Nc3', 1);

-- Query
SELECT
	m.movelist,
	(NLEVEL(m.movelist) + 1) / 2.0 AS move,
	m.sort,
	COUNT(m2.*) AS children
FROM
	moves m
LEFT JOIN
	moves m2
ON
	m2.movelist ~ CONCAT(m.movelist, '.*{1}')::LQUERY
GROUP BY
	m.movelist,
	m.sort
ORDER BY
	2 ASC,
	3 ASC;