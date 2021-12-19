import SparkMD5 from "spark-md5";
import moment from "moment";

import { RepertoireModel } from "../lib/types/models/Repertoire";
import { ApolloClient, ApolloError } from "@apollo/client";
import { REPERTOIRE_MOVE_FRAG } from "../api/queries";

export function getDBMoveNumFromIndex(index: number) {
	return Math.floor(((index + 2) / 2) * 10);
}

export function getIndexFromDBMoveNum(db_move_num: number) {
	return (((db_move_num / 10) * 2) - 2);
}

export function getClientMoveNumFromIndex(index: number) {
	return Math.floor(index / 2) + 1;
}

export function getClientMoveNumFromDBMoveNum(db_move_num: number, black_suffix?: string, white_suffix?: string, black_substitute?: string) {
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

export function getColorFromMoveCount(count: number) {
	return ((count % 2) === 1) ? "white" : "black";
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

export function getRepertoireNextReview(next_review: RepertoireModel["nextReview"]) {
	interface ReviewString { t_key: string | null, val: string | number | null };

	const data: ReviewString = {
		t_key : null,
		val   : null
	}

	if (!next_review) {
		data.t_key = "common:na";

		return data;
	}

	const review = new Date(next_review);
	const now    = new Date();

	if (now > review) {
		data.t_key = "common:now";

		return data;
	}

	const day_diff = Math.floor((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

	if (day_diff !== 0) {
		data.t_key = (day_diff !== 1) ? "common:days" : "common:day";
		data.val   = day_diff;

		return data;
	}

	data.val = moment(review).format("h:ss a");

	return data;
}

export function getMove(client: ApolloClient<object>, id: string | null) {
	return client.readFragment({
		id       : "RepertoireMove:" + id,
		fragment : REPERTOIRE_MOVE_FRAG
	});
}

export function hasPremiumLockoutError(error?: ApolloError) {
	if (!error) {
		return false;
	}

	for (const e of error.graphQLErrors) {
		if (e.extensions?.code >= 200000 && e.extensions?.code < 300000) {
			return true;
		}
	}

	return false;
}

export function formateDate(date: string) {
	if (!date) {
		return null;
	}

	let missing_year    = false;
	let missing_month   = false;
	let missing_day     = false;
	const unknown_year  = "????";
	const unknown_month = "-??-";
	const unknown_day   = "-??";

	if (date.indexOf(unknown_year) !== -1) {
		missing_year = true;
		date         = date.replace(unknown_year, "2199");
	}

	if (date.indexOf(unknown_month) !== -1) {
		missing_month = true;
		date          = date.replace(unknown_month, "-11-");
	}

	if (date.indexOf(unknown_day) !== -1) {
		missing_day = true;
		date        = date.replace(unknown_day, "-28");
	}

	date = (new Date(date)).toLocaleDateString();

	if (missing_year) {
		date = date.replace(/\b2199\b/, "????");
	}

	if (missing_month) {
		date = date.replace(/\b11\b/, "??");
	}

	if (missing_day) {
		date = date.replace(/\b28\b/, "??");
	}

	return date;
}