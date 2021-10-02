import React from "react";
import ReactDOM from "react-dom";

import i18n from "./i18n";
import FirebaseAuth from "./lib/Firebase";
import AuthState from "./stores/AuthState";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

import ActionCable from "actioncable";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { ApolloProvider, ApolloLink, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const cable          = ActionCable.createConsumer("ws://localhost:3001/cable")
const http_link      = createHttpLink({ uri: "http://localhost:3001/graphql" });
const shouldUseCable = () => {
	return true;
};
const cable_link     = new ActionCableLink({cable, connectionParams: { token : AuthState.token }});
const link           = ApolloLink.split(
	shouldUseCable,
	cable_link,
	http_link,
);
const client         = new ApolloClient({
	link  : link,
	cache : new InMemoryCache()
});

AuthState.provideClient(client);
AuthState.provideLink(cable_link);
FirebaseAuth(client);
i18n.setDefaultNamespace("common");

(async () => {
	ReactDOM.render(
		<React.StrictMode>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</React.StrictMode>,
		document.getElementById("root")
	);
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
