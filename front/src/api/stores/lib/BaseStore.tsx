import { makeAutoObservable } from "mobx";

export default class BaseStore {
	private _records: { [id: string]: any } = {};

	public get records() {
		return this._records;
	}

	public constructor() {
		makeAutoObservable(this);
	}

	public add(id: string, data: any): void {
		this._records[id] = data;
	}

	public addMany(data: any) {
		this._records = Object.assign(this._records, data);
	}

	public remove(id: string): void {
		delete this._records[id];
	}

	public empty(): void {
		this._records = {};
	}
}