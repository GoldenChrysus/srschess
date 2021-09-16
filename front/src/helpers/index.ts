import * as crypto from "crypto";

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
	const hash = crypto.createHash("md5").update(`${repertoire_id}:${move_num}:${move}:${fen}`).digest("hex");

	return [
		hash.substr(0, 8),
		hash.substr(8, 4),
		hash.substr(12, 4),
		hash.substr(16, 4),
		hash.substr(20, 12)
	].join("-");
}