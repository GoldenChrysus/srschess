import Model from "./BaseModel";

export default class User extends Model {
	public static type = "user";

	public static attributes = {
		email    : { type : "string" },
		password : { type : "string" },
		bearer   : { type : "string" }
	};

	public static relationships = {
		repertoires : {
			type    : "hasMany",
			model   : "repertoire",
			inverse : "user"
		}
	};
}