import Coordinator, { RequestStrategy, SyncStrategy } from "@orbit/coordinator";

import { memory } from "./sources/memory";
import { remote } from "./sources/remote";
import { BaseStore, StoreRegistry } from "./stores";

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


memory.on("transform", (data) => {
	let store: BaseStore;

	for (const op of data.operations) {
		switch (op.op) {
			case "addRecord":
			case "updateRecord":
				store = StoreRegistry.get(op.record.type);

				if (!store) {
					break;
				}

				store.add(op.record.id, op.record);
				break;

			case "removeRecord":
				store = StoreRegistry.get(op.record.type);

				if (!store) {
					break;
				}

				store.remove(op.record.id);
				break;

			default:
				break;
		}
	}
});

export default coordinator;