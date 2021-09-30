<?php
function reindex($rows, $columns, $force_upper = true) {
	if(!is_array($columns)) {
		$columns = [$columns];
	}

	$columns = $force_upper ? array_map('strtoupper', $columns) : $columns;
	$indexed = [];
	$set     = null;

	foreach($rows as $row) {
		foreach($columns as $index => $column) {
			if(!array_key_exists($column, $row)) {
				throw new Exception("{$column} does not exist");
			}

			$tmp_value = $row[$column];

			if(!isset($set)) {
				if(!isset($indexed[$tmp_value])) {
					$indexed[$tmp_value] = [];
				}

				$set = &$indexed[$tmp_value];
			}
			else if($index < count($columns)) {
				if(!isset($set[$tmp_value])) {
					$set[$tmp_value] = [];
				}

				$set = &$set[$tmp_value];
			}

			if($index === count($columns) - 1) {
				$set[] = $row;
			}
		}

		unset($set);
	}

	return $indexed;
}

$data = [
	[
		"id" => 1,
		"move" => 10,
		"val" => "e4",
		"parent_id" => 0
	],
	[
		"id" => 2,
		"move" => 15,
		"val" => "e5",
		"parent_id" => 1
	],
	[
		"id" => 3,
		"move" => 15,
		"val" => "c5",
		"parent_id" => 1
	],
	[
		"id" => 4,
		"move" => 20,
		"val" => "Nf3",
		"parent_id" => 2
	],
	[
		"id" => 5,
		"move" => 25,
		"val" => "Nf6",
		"parent_id" => 4
	],
	[
		"id" => 6,
		"move" => 25,
		"val" => "Nc3",
		"parent_id" => 4
	]
];

$data = reindex($data, ["move", "parent_id"], false);

echo "<pre>";
print_r($data);