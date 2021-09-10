import MemorySource from "@orbit/memory";

import { schema } from "../schema";
import { keymap } from "../keymap";

export const memory = new MemorySource({
	schema,

	keyMap : keymap
});