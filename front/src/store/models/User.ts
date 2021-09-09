import { Model, Attribute } from "@datx/core";
import { jsonapi } from "@datx/jsonapi";
import Repertoire from "./Repertoire";

export default class User extends jsonapi(Model) {
	static type = "user";

	@Attribute()
	public email!: string;

	@Attribute()
	private password!: string;

	@Attribute()
	public bearer!: string;

	@Attribute({ toMany: Repertoire, referenceProperty: "user" })
	public repertoires!: Array<Repertoire>;
}