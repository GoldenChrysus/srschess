import { KeyMap } from "@orbit/data";
import { memory } from "../sources/memory";

interface Schema {
	attributes     : {},
	relationships? : {}
}

export default class Model {
	public static type: string;
	public static attributes: {};
	public static relationships?: {};

	public static readonly records: { [id: string]: any } = {};

	public static async byId(id: string) {
		if (this.records[id]) {
			return this.records[id];
		} else {
			let record = await memory.query(q =>
				q.findRecord({
					type : this.type,
					id   : id
				})
			);

			if (record) {
				this.records[record.id] = record;

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

	private static getAttributes() {
		return this.attributes;
	}

	private static getRelationships() {
		return this.relationships;
	}
}