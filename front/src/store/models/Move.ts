import { Model, Attribute, IIdentifier } from "@datx/core";
import { IJsonapiModel, IRequestOptions, jsonapi } from "@datx/jsonapi";
import * as crypto from "crypto";
import Repertoire from "./Repertoire";

export default class Move extends jsonapi(Model) {
	static type         = "move";
	static enableAutoId = false;

	save(options?: IRequestOptions):Promise<IJsonapiModel>{
		if (!this.meta.id) {
			let hash = crypto.createHash("md5").update(`${this.repertoire.meta.id}-${this.move_number}-${this.move}`).digest("hex");
			
			this.meta.id = [
				hash.substr(0, 8),
				hash.substr(8, 4),
				hash.substr(12, 4),
				hash.substr(16, 4),
				hash.substr(20, 12)
			].join("-");
		}

		return super.save(options);
	}

	@Attribute()
	public move_number!: bigint;

	@Attribute()
	public move!: string;

	@Attribute()
	public fen!: string;

	@Attribute()
	public sort!: bigint;

	@Attribute({ toOne: Repertoire })
	public repertoire!: Repertoire;
}

Attribute({ toMany: Move, referenceProperty: "parent" })(Move, "children")