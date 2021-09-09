import { Collection } from "@datx/core";
import { jsonapi } from "@datx/jsonapi";

import Move from "./models/Move";
import Repertoire from "./models/Repertoire";
import User from "./models/User";

export class PrimaryStore extends jsonapi(Collection) {
	public static types = [User, Repertoire, Move]
}

export const store = new PrimaryStore();