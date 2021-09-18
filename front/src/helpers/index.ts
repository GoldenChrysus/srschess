import SparkMD5 from "spark-md5";

export function getMoveNumFromIndex(index: number) {
	return Math.floor(index / 2) + 1;
}

export function getMoveNumFromDB(db_move_num: number, black_suffix?: string, white_suffix?: string, black_substitute?: string) {
	const is_black  = ((db_move_num % 10) === 5);
	const real_move = Math.floor(db_move_num / 10);
	let text: string = String(real_move);

	if (is_black) {
		if (black_substitute !== undefined) {
			return black_substitute;
		}

		text += black_suffix;
	} else {
		text += white_suffix;
	}

	return text;
}

export function generateUUID(move_num: number, move: string, fen: string, repertoire_id?: number) {
	const hash = SparkMD5.hash(repertoire_id + ":" + move_num + ":" + move + ":" + fen);

	return (
		hash.slice(0, 8) + "-" + 
		hash.slice(8, 12) + "-" +
		hash.slice(12, 16) + "-" +
		hash.slice(16, 20) + "-" +
		hash.slice(20, 32)
	);
}