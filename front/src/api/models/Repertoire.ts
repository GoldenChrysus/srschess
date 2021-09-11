import Model from "./BaseModel";

export default class Repertoire extends Model {
	public static type = "repertoire";

	public static attributes = {
		name : { type : "string" },
		side : { type : "string" }
	};

	public static relationships = {
		user : {
			type    : "hasOne",
			model   : "user",
			inverse : "repertoires"
		},
		moves : {
			type    : "hasMany",
			model   : "move",
			inverse : "repertoire"
		}
	};
}