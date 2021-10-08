import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider, setPersistence, browserLocalPersistence, User } from "firebase/auth";
import { auth as FirebaseUIAuth } from "firebaseui";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import "firebaseui/dist/firebaseui.css";

import AuthState from "../stores/AuthState";
import { CREATE_USER } from "../api/queries";

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

	const handleAuth = (res: User | any | null, from_ui?: boolean) => {
		const user = (from_ui) ? res.user : res;

		if (!user) {
			AuthState.logout();
			return false;
		}

		AuthState.login(user.uid, user.accessToken);

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
			})
			.catch((err) => {
				// TODO: Revoke the session
				console.error(err);
			});
	};

	auth.onAuthStateChanged(handleAuth);

	setPersistence(auth, browserLocalPersistence)
		.then(() => {
			const ui = new FirebaseUIAuth.AuthUI(getAuth(app));

			ui.start(
				"#firebase-auth",
				{
					signInOptions : [
						EmailAuthProvider.PROVIDER_ID
					]
				}
			);
		})
		.catch((err) => {
			console.error(err);
		});
}

export default FirebaseAuth;