import { computed, makeAutoObservable, observable } from "mobx";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";
import { RepertoireModel } from "../lib/types/models/Repertoire";

class Repertoire implements RepertoireModel {
	public id: RepertoireModel["id"];
	public name: RepertoireModel["name"];
	public side: RepertoireModel["side"];

	private _lessonQueueLength: RepertoireModel["lessonQueueLength"];
	private _lessonQueue: RepertoireModel["lessonQueue"];
	private _reviewQueueLength: RepertoireModel["reviewQueueLength"];
	private _reviewQueue: RepertoireModel["reviewQueue"];

	constructor(model: RepertoireModel) {
		makeAutoObservable(this);

		this.id = model.id;
		this.name = model.name;
		this.side = model.side;

		this._lessonQueueLength = model.lessonQueueLength;
		this._lessonQueue       = model.lessonQueue;
		this._reviewQueueLength = model.reviewQueueLength;
		this._reviewQueue       = model.reviewQueue;
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
}

class RepertoireStore {
	public repertoires: Map<number, Repertoire> = observable.map<number, Repertoire>();

	constructor() {
		makeAutoObservable(this);
	}

	add(repertoire: RepertoireModel) {
		const id = repertoire.id;

		if (this.repertoires.has(id)) {
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
				repertoire.reviewQueueLength = (repertoire.reviewQueueLength) ? repertoire.reviewQueueLength - 1 : 0;

				break;

			case "lesson":
				repertoire.lessonQueueLength = (repertoire.lessonQueueLength) ? repertoire.lessonQueueLength - 1 : 0;

				break;

			default:
				break;
		}
	}
}

export default new RepertoireStore();