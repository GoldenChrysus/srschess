import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider, setPersistence, browserLocalPersistence, User } from "firebase/auth";
import { auth as FirebaseUIAuth } from "firebaseui";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import "firebaseui/dist/firebaseui.css";

import store from "../redux/store";
import { login, logout } from "../redux/slices/auth";
import { CREATE_USER } from "../api/queries";

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
				// TODO: Revoke the session
				console.error(err);
			});
	};

	const handleTokenChange = (user: User | null) => {
		console.log("TOKEN CHANGE");

		if (!user) {
			return;
		}

		store.dispatch(login(user));
	}

	auth.onAuthStateChanged(handleAuth);
	auth.onIdTokenChanged(handleTokenChange);

	setPersistence(auth, browserLocalPersistence)
		.then(() => {
			const ui = new FirebaseUIAuth.AuthUI(getAuth(app));

			ui.start(
				"#firebase-auth",
				{
					signInOptions : [
						EmailAuthProvider.PROVIDER_ID,
					],
					callbacks : {
						signInSuccessWithAuthResult : (res: any) => {
							console.log("SIGN IN SUCCESS");

							auth.updateCurrentUser(res.user).then(() => {
								store.dispatch(login(res.user));
							});
							return false;
						}
					}
				}
			);
		})
		.catch((err) => {
			console.error(err);
		});
}

export default FirebaseAuth;