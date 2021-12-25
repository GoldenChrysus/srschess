import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import i18n from "./i18n";
import FirebaseAuth from "./lib/Firebase";
import AuthState from "./stores/AuthState";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { TYPES as GRAPHQL_TYPES } from "./api/types";
import { hasPremiumLockoutError, notifyError } from "./helpers";

import ActionCable from "actioncable";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { ApolloProvider, ApolloLink, ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const cable          = ActionCable.createConsumer("ws://" + process.env.REACT_APP_API_ADDRESS + "/cable")
const http_link      = createHttpLink({ uri: "http://" + process.env.REACT_APP_API_ADDRESS + "/graphql" });
const shouldUseCable = () => {
	return true;
};
const error_link     = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		if (hasPremiumLockoutError(graphQLErrors)) {
			return;
		}

		notifyError(graphQLErrors[0].extensions?.code);
	}
});
const cable_link     = new ActionCableLink({cable, connectionParams: { token : localStorage.getItem("firebase_token") || AuthState.token }});
const link           = ApolloLink.split(
	shouldUseCable,
	cable_link,
	http_link,
);
const client         = new ApolloClient({
	link     : from([error_link, link]),
	cache    : new InMemoryCache(),
	typeDefs : GRAPHQL_TYPES
});

AuthState.provideClient(client);
AuthState.provideLink(cable_link);
FirebaseAuth(client);
i18n.setDefaultNamespace("common");

(async () => {
	ReactDOM.render(
		<React.StrictMode>
			<ApolloProvider client={client}>
				<Provider AuthState={AuthState}>
					<App />
				</Provider>
			</ApolloProvider>
		</React.StrictMode>,
		document.getElementById("root")
	);
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
