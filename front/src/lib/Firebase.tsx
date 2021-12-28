import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider, setPersistence, browserLocalPersistence, User } from "firebase/auth";
import { auth as FirebaseUIAuth } from "firebaseui";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import "firebaseui/dist/firebaseui.css";

import AuthState from "../stores/AuthState";
import { CREATE_USER } from "../api/queries";
import { runInAction } from "mobx";

function FirebaseAuth(client: ApolloClient<NormalizedCacheObject>) {
	const app = initializeApp({
		apiKey            : process.env.REACT_APP_FIREBASE_KEY,
		authDomain        : process.env.REACT_APP_FIREBASE_DOMAIN,
		projectId         : process.env.REACT_APP_FIREBASE_PROJECT,
		storageBucket     : process.env.REACT_APP_FIREBASE_BUCKET,
		messagingSenderId : process.env.REACT_APP_FIREBASE_SENDER,
		appId             : process.env.REACT_APP_FIREBASE_APP,
		measurementId     : process.env.REACT_APP_FIREBASE_MEASUREMENT
	});
	const auth = getAuth(app);

	AuthState.provideAuth(auth);

	const handleAuth = (res: User | any | null, from_ui?: boolean) => {
		const user = (from_ui) ? res.user : res;

		console.log("gh1");

		if (!user) {
			AuthState.logout();
			return false;
		}

		console.log("gh2");
		runInAction(() => AuthState.login(user));

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
		console.log("gh4");
		console.log(user);

		if (!user) {
			return;
		}

		runInAction(() => AuthState.login(user));
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
							console.log("gh3");
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