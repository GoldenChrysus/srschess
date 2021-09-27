import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import * as FirebaseUI from "firebaseui";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import "firebaseui/dist/firebaseui.css";

import AuthState from "../stores/AuthState";
import { CREATE_USER, GET_REPERTOIRES } from "../api/queries";

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
	const ui = new FirebaseUI.auth.AuthUI(getAuth(app));

	ui.start(
		"#firebase-auth",
		{
			signInOptions : [
				EmailAuthProvider.PROVIDER_ID
			],
			callbacks: {
				signInSuccessWithAuthResult: (result) => {
					AuthState.setData(result.user.uid, result.user.accessToken);

					client
						.mutate({
							mutation       : CREATE_USER,
							refetchQueries : [
								GET_REPERTOIRES
							],
							variables : {
								email : result.user.email,
								uid   : result.user.uid
							}
						})
						.then(() => {
							// All good
						})
						.catch((err) => {
							// TODO: Revoke the session
							console.error(err);
						});

					return false;
				},
				uiShown: () => {}
			}
		}
	);
}

export default FirebaseAuth;