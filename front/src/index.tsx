import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import coordinator from "./api/coordinator";

import { schema } from "./api/schema";
import User from "./api/models/User";
import Repertoire from "./api/models/Repertoire";
import Move from "./api/models/Move";

(async () => {
	schema.upgrade({
		models : {
			user       : User.getSchema(),
			repertoire : Repertoire.getSchema(),
			move       : Move.getSchema()
		}
	});

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
