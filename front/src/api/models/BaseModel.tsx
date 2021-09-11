import { memory } from "../sources/memory";
import BaseStore from "./BaseStore";

interface Schema {
	attributes     : {},
	relationships? : {}
}

export default class Model {
	public static type: string;
	public static attributes: {};
	public static relationships?: {};

	public static readonly store = new BaseStore();

	public static async byId(id: string | number) {
		const str_id: string = String(id);

		if (this.store.records[str_id]) {
			return this.store.records[str_id];
		} else {
			let record = await memory.query(q =>
				q.findRecord({
					type : this.type,
					id   : str_id
				})
			);

			if (record) {
				this.store.add(record.id, record);
				return record;
			}
		}
	}

	public static getSchema() {
		const schema: Schema = {
			attributes : this.attributes
		};

		if (this.relationships) {
			schema.relationships = this.relationships;
		}

		return schema;
	}
}