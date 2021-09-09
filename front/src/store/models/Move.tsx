import { Model, Attribute, IIdentifier } from "@datx/core";
import { IJsonapiModel, IRequestOptions, jsonapi } from "@datx/jsonapi";
import * as crypto from "crypto";
import Repertoire from "./Repertoire";

export default class Move extends jsonapi(Model) {
	static type         = "move";
	static enableAutoId = false;

	save(options?: IRequestOptions):Promise<IJsonapiModel>{
		if (!this.id) {
			let hash = crypto.createHash("md5").update(`${this.repertoire.id}-${this.move_number}-${this.move}`).digest("hex");
			
			this.id = [
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
	public id!: string;

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

	@Attribute({ toOne: Move })
	public parent!: Move;

	@Attribute({ toMany: Move })
	public children!: Move;
}