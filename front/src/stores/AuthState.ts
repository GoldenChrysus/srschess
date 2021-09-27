import { makeAutoObservable } from "mobx";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"

class AuthState {
	authenticated: boolean = false;
	uid: string = "";
	token: string = "";
	link?: ActionCableLink = undefined;

	constructor() {
		makeAutoObservable(this);

		this.token = localStorage.getItem("firebase-token") || "";
		this.uid   = localStorage.getItem("firebase-uid") || "";

		this.updateLinkConnection();
		this.updateAuthenticated();
	}

	setData(uid: string, token: string) {
		this.uid   = uid;
		this.token = token;

		localStorage.setItem("firebase-token", this.token);
		localStorage.setItem("firebase-uid", this.uid);
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

	provideLink(link: ActionCableLink) {
		this.link = link;
	}
}

export default new AuthState();