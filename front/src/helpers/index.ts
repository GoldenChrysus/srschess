export function getMoveNumFromIndex(index: number) {
	return Math.floor(index / 2) + 1;
}

export function getMoveNumFromDB(db_move_num: number, text_for_black?: string) {
	const is_black  = ((db_move_num % 10) === 5);
	const real_move = Math.floor(db_move_num / 10);

	return (is_black && text_for_black !== undefined) ? text_for_black : real_move;
}