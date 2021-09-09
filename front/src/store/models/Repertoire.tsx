import { Model, Attribute } from "@datx/core";
import { jsonapi } from "@datx/jsonapi";
import User from "./User";

export default class Repertoire extends jsonapi(Model) {
	static type = "repertoire";

	@Attribute()
	public name!: string;

	@Attribute()
	public side!: string;

	@Attribute({ toOne: User })
	public user!: User;
}