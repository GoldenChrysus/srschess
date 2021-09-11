import * as crypto from "crypto";

import Model from "./BaseModel";

export default class Move extends Model {
	public static type = "move";

	public static attributes = {
		move_number : { type : "number" },
		move        : { type : "string" },
		fen         : { type : "string" },
		sort        : { type : "number" }
	};

	public static relationships = {
		children : {
			type    : "hasMany",
			model   : "move",
			inverse : "parent"
		},
		parent : {
			type    : "hasOne",
			model   : "move",
			inverse : "children"
		},
		repertoire : {
			type    : "hasOne",
			model   : "repertoire",
			inverse : "moves"
		}
	};

	protected static calculateId(attributes: any, relationships: any): string {
		return this.generateId(relationships.repertoire.id, attributes.move_number, attributes.move);
	}

	public static generateId(repertoire_id: string, move_number: string, move: string): string {
		let hash = crypto.createHash("md5").update(`${repertoire_id}:${move_number}:${move}`).digest("hex");
		
		return [
			hash.substr(0, 8),
			hash.substr(8, 4),
			hash.substr(12, 4),
			hash.substr(16, 4),
			hash.substr(20, 12)
		].join("-");
	}
}