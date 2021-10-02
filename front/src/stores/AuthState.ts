import { makeAutoObservable } from "mobx";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

class AuthState {
	authenticated: boolean = false;
	uid: string = "";
	token: string = "";
	link?: ActionCableLink = undefined;
	client?: ApolloClient<NormalizedCacheObject> = undefined;

	constructor() {
		makeAutoObservable(this);
		this.updateLinkConnection();
	}

	login(uid: string, token: string) {
		this.uid   = uid;
		this.token = token;

		this.updateLinkConnection();
		this.updateAuthenticated();
	}

	logout() {
		this.uid   = "";
		this.token = "";

		this.updateLinkConnection();
		this.updateAuthenticated();
	}

	updateAuthenticated() {
		this.authenticated = (this.token?.length > 0 && this.uid?.length > 0);
	}

	updateLinkConnection() {
		if (!this.link) {
			return;
		}

		this.link.connectionParams = {
			token : this.token
		};
	}

	provideClient(client: ApolloClient<NormalizedCacheObject>) {
		this.client = client;
	}

	provideLink(link: ActionCableLink) {
		this.link = link;
	}
}

export default new AuthState();