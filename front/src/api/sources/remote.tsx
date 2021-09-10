import JSONAPISource, { Resource, JSONAPISerializer } from "@orbit/jsonapi";

import { schema } from "../schema";
import { keymap } from "../keymap";

class CustomJSONAPISerializer extends JSONAPISerializer {
	serializeId(resource: Resource, record: any, model: any) {
	}
}

export const remote = new JSONAPISource({
	schema,

	keyMap : keymap,
	name   : "remote",
	host   : "http://localhost:3001/api",

	SerializerClass : CustomJSONAPISerializer
});