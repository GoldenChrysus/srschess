import Coordinator, { RequestStrategy, SyncStrategy } from "@orbit/coordinator";

import { memory } from "./sources/memory";
import { remote } from "./sources/remote";

const coordinator = new Coordinator({
	sources : [ memory, remote ]
});

// Query server when pulling from memory
coordinator.addStrategy(
	new RequestStrategy({
		source   : "memory",
		on       : "beforeQuery",
		target   : "remote",
		action   : "query",
		blocking : true
	})
);

// Sync all memory updates to server
coordinator.addStrategy(
	new RequestStrategy({
		source   : "memory",
		on       : "beforeUpdate",
		target   : "remote",
		action   : "update",
		blocking : true
	})
);

// Sync all server data to memory
coordinator.addStrategy(
	new SyncStrategy({
		source   : "remote",
		target   : "memory",
		blocking : true
	})
);

export default coordinator;