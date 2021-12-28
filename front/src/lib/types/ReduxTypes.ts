import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Auth, User } from "firebase/auth";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";
import { CollectionModel } from "./models/Collection";
import { RepertoireModel, RepertoireMoveModel } from "./models/Repertoire";

export interface AuthState {
	show_login    : boolean
	authenticated : boolean
	auth_object?  : Auth
	user?         : User
	token         : string
	link?         : ActionCableLink
	client?       : ApolloClient<NormalizedCacheObject>
}

export interface ReduxStore {
	Auth : {
		show_login    : boolean
		authenticated : boolean
		auth_object?  : Auth
		user?         : User
		link?         : ActionCableLink
		client?       : ApolloClient<NormalizedCacheObject>
	},
	Chess : {
		best_move   : string
		move_id     : RepertoireMoveModel["id"] | null
		repertoire? : RepertoireModel | null
		collection? : CollectionModel | null
	}
};