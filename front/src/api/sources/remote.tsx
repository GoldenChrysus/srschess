import JSONAPISource, { Resource, JSONAPISerializer } from "@orbit/jsonapi";

import { schema } from "../schema";
import { keymap } from "../keymap";

class CustomJSONAPISerializer extends JSONAPISerializer {
	resourceKey(type: string) {
		if (type === "move") {
			return "id";
		}

		return "id";
	}

	serializeId(resource: Resource, record: any, model: any) {
		if (record.type === "move") {
			let value = this.resourceId(record.type, record.id);

			resource.id = value;

			return;
		}

		return;
	}
}

export const remote = new JSONAPISource({
	schema,

	keyMap : keymap,
	name   : "remote",
	host   : "http://localhost:3001/api",

	SerializerClass : CustomJSONAPISerializer
});