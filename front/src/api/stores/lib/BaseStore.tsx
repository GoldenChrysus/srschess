import { makeAutoObservable } from "mobx";

export default class BaseStore {
	public readonly records: { [id: string]: any } = {};

	public constructor() {
		makeAutoObservable(this);
	}

	public add(id: string, data: any): void {
		this.records[id] = data;
	}

	public remove(id: string): void {
		delete this.records[id];
	}
}