import { computed, makeAutoObservable, observable } from "mobx";
import moment from "moment";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";
import { RepertoireModel } from "../lib/types/models/Repertoire";

interface ReviewString { t_key: string | null, val: string | number | null };
class Repertoire implements RepertoireModel {
	public id: RepertoireModel["id"];
	public name: RepertoireModel["name"];
	public side: RepertoireModel["side"];

	private _lessonQueueLength: RepertoireModel["lessonQueueLength"];
	private _lessonQueue: RepertoireModel["lessonQueue"];
	private _reviewQueueLength: RepertoireModel["reviewQueueLength"];
	private _reviewQueue: RepertoireModel["reviewQueue"];
	private _nextReview: RepertoireModel["nextReview"];

	constructor(model: RepertoireModel) {
		makeAutoObservable(this);

		this.id   = model.id;
		this.name = model.name;
		this.side = model.side;

		this._lessonQueue       = model.lessonQueue;
		this._lessonQueueLength = this._lessonQueue?.length ?? model.lessonQueueLength;
		this._reviewQueue       = model.reviewQueue;
		this._reviewQueueLength = this._reviewQueue?.length ?? model.reviewQueueLength;
		this._nextReview        = model.nextReview;
	}

	set lessonQueueLength(val: number) {
		this._lessonQueueLength = val;
	}

	get lessonQueueLength(): number {
		return this._lessonQueueLength ?? (this._lessonQueue?.length ?? 0);
	}

	set reviewQueueLength(val: number) {
		this._reviewQueueLength = val;
	}

	get reviewQueueLength(): number {
		return this._reviewQueueLength ?? (this._reviewQueue?.length ?? 0);
	}

	get nextReviewString(): ReviewString {
		const next = this._nextReview;
		const data: ReviewString = {
			t_key : null,
			val   : null
		}

		if (!next) {
			data.t_key = "common:na";

			return data;
		}

		const review = new Date(next);
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
}

class RepertoireStore {
	public repertoires: Map<number, Repertoire> = observable.map<number, Repertoire>();

	constructor() {
		makeAutoObservable(this);
	}

	add(repertoire: RepertoireModel, source: string) {
		const id = repertoire.id;

		if (this.repertoires.has(id) && source === "component") {
			return;
		}

		this.repertoires.set(id, new Repertoire(repertoire));
	}

	get(id: RepertoireModel["id"] | undefined): Repertoire | undefined {
		if (!id) {
			return undefined;
		}

		return this.repertoires.get(id);
	}

	increaseQueue(id: RepertoireModel["id"] | undefined) {
		if (!id) {
			return;
		}

		const repertoire = this.get(id);

		if (!repertoire) {
			return;
		}

		repertoire.lessonQueueLength = (repertoire.lessonQueueLength) ? repertoire.lessonQueueLength + 1 : 1;
	}

	reduceQueue(id: RepertoireModel["id"] | undefined, type: ChessControllerProps["mode"]) {
		if (!id) {
			return;
		}

		const repertoire = this.get(id);

		if (!repertoire) {
			return;
		}

		switch (type) {
			case "review":
				// repertoire.reviewQueueLength = (repertoire.reviewQueueLength) ? repertoire.reviewQueueLength - 1 : 0;

				break;

			case "lesson":
				// repertoire.lessonQueueLength = (repertoire.lessonQueueLength) ? repertoire.lessonQueueLength - 1 : 0;

				break;

			default:
				break;
		}
	}
}

export default new RepertoireStore();