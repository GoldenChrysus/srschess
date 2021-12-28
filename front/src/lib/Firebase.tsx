import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, User } from "firebase/auth";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import store from "../redux/store";
import { login, logout } from "../redux/slices/auth";
import { CREATE_USER } from "../api/queries";
import { notifyError } from "../helpers";

const app = initializeApp({
	apiKey            : process.env.REACT_APP_FIREBASE_KEY,
	authDomain        : process.env.REACT_APP_FIREBASE_DOMAIN,
	projectId         : process.env.REACT_APP_FIREBASE_PROJECT,
	storageBucket     : process.env.REACT_APP_FIREBASE_BUCKET,
	messagingSenderId : process.env.REACT_APP_FIREBASE_SENDER,
	appId             : process.env.REACT_APP_FIREBASE_APP,
	measurementId     : process.env.REACT_APP_FIREBASE_MEASUREMENT
});

export const auth = getAuth(app);

function FirebaseAuth(client: ApolloClient<NormalizedCacheObject>) {
	const handleAuth = (res: User | any | null, from_ui?: boolean) => {
		const user = (from_ui) ? res.user : res;

		console.log("AUTH CHANGED");

		if (!user) {
			console.log(res);
			console.log("LOGOUT");
			store.dispatch(logout());
			return false;
		}

		console.log("AUTH OKAY");
		store.dispatch(login(user));

		client
			.mutate({
				mutation       : CREATE_USER,
				refetchQueries : "active",
				variables : {
					email : user.email,
					uid   : user.uid
				}
			})
			.then(() => {
				// All good
				localStorage.setItem("firebase_uid", user.uid);
				localStorage.setItem("firebase_token", user.accessToken);
			})
			.catch((err) => {
				auth.signOut();
				notifyError();
				console.error(err);
			});
	};

	const handleTokenChange = (user: User | any | null) => {
		console.log("TOKEN CHANGE");

		if (!user) {
			return;
		}

		store.dispatch(login(user));
		localStorage.setItem("firebase_uid", user.uid);
		localStorage.setItem("firebase_token", user.accessToken);
	}

	auth.onAuthStateChanged(handleAuth);
	auth.onIdTokenChanged(handleTokenChange);

	setPersistence(auth, browserLocalPersistence)
		.then(() => {
		})
		.catch((err) => {
			console.error(err);
		});
}

export default FirebaseAuth;