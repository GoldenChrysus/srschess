import { Schema } from "@orbit/data";

export const schema = new Schema({
	models : {
		user : {
			attributes : {
				email    : { type : "string" },
				password : { type : "string" },
				bearer   : { type : "string" }
			},
			relationships : {
				repertoires : {
					type    : "hasMany",
					model   : "repertoire",
					inverse : "user"
				}
			}
		},
		repertoire : {
			attributes : {
				name : { type : "string" },
				side : { type : "string" }
			},
			relationships : {
				user : {
					type    : "hasOne",
					model   : "user",
					inverse : "repertoires"
				}
			}
		}
	}
});