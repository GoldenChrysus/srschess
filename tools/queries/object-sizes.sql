SELECT
	relname AS object_name,
	relkind AS object_type,
	reltuples AS entries,
	pg_size_pretty(pg_table_size(oid)) AS size
FROM
	pg_class
WHERE
	relkind IN ('r', 'i', 'm')
ORDER BY
	pg_table_size(oid) DESC;