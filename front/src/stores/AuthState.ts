import { makeAutoObservable } from "mobx";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Auth, User } from "firebase/auth";

class AuthState {
	needs_auth: boolean = false;
	authenticated: boolean = false;
	auth?: Auth = undefined;
	user?: User = undefined;
	uid: string = "";
	token: string = "";
	link?: ActionCableLink = undefined;
	client?: ApolloClient<NormalizedCacheObject> = undefined;

	constructor() {
		makeAutoObservable(this);
		this.updateLinkConnection();
	}

	login(user: User | any) {
		this.user       = user;
		this.uid        = user.uid;
		this.token      = user.accessToken;
		this.needs_auth = false;

		this.updateLinkConnection();
		this.updateAuthenticated();
	}

	logout() {
		this.user  = undefined;
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

	provideAuth(auth: Auth) {
		this.auth = auth;
	}

	setNeedsAuth(val: boolean) {
		this.needs_auth = val;
	}
}

export default new AuthState();