import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import coordinator from "./api/coordinator";

import { schema } from "./api/schema";
import { map } from "./api/models/";
import { StoreRegistry } from "./api/stores/";

(async () => {
	const new_schema: { [key: string]: any } = { models: {} };

	for (let key in map) {
		StoreRegistry.init(map[key].type);
		new_schema.models[map[key].type] = map[key].getSchema();
	}

	schema.upgrade(new_schema);
	await coordinator.activate();
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById("root")
	);
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
