import { BaseStore } from "./../";

export default class StoreRegistry {
	public static registry: { [key: string]: BaseStore } = {};

	public static register(type: string, store: BaseStore) {
		this.registry[type] = store;
	}

	public static init(type: string) {
		let store = new BaseStore();

		this.register(type, store);
	}

	public static get(type: string) {
		return this.registry[type];
	}
}