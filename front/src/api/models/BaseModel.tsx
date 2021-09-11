import { memory } from "../sources/memory";
import BaseStore from "./BaseStore";

interface Schema {
	attributes     : {},
	relationships? : {}
}

interface RecordData { 
	type           : string,
	id             : string,
	attributes     : { [key: string]: any },
	relationships? : { [key: string]: any }
}

export default class Model {
	public static type: string;
	public static attributes: {};
	public static relationships?: {};

	public static readonly store = new BaseStore();

	public static async byId(id: string | number, use_cache: boolean = true) {
		const str_id: string = String(id);

		if (use_cache) {
			if (this.store.records[str_id]) {
				return this.store.records[str_id];
			}

			try {
				let record = memory.cache.query(q =>
					q.findRecord({
						type : this.type,
						id   : str_id
					})
				);

				if (record) {
					return record;
				}
			} catch {}
		}

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

	public static async add(attributes: any, relationships?: any) {
		const id: string       = this.calculateId(attributes, relationships);
		const data: RecordData = {
			type       : this.type,
			id         : id,
			attributes : attributes
		};

		if (relationships) {
			data.relationships = {};

			for (let key in relationships) {
				data.relationships[key] = {
					data : relationships[key]
				};
			}
		}

		await memory.update(t => t.addRecord(data));

		let record = await this.byId(id);

		if (record) {
			this.store.add(record.id, record);
			return record;
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

	protected static calculateId(attributes: any, relationships: any): string {
		return "";
	}
}