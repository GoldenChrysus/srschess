import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

import { cable_link } from "../../lib/Apollo";
import { auth } from "../../lib/Firebase";
import { AuthState } from "../../lib/types/ReduxTypes";

const initialState: AuthState = {
	authenticated : false
};

interface LoginPayload {
	uid?: string,
	token?: string
}

export const AuthSlice = createSlice({
	name: "Auth",
	initialState,
	reducers : {
		login(state, action: PayloadAction<LoginPayload>) {
			state.uid           = action.payload.uid
			state.token         = action.payload.token;
			state.authenticated = true;
			
			cable_link.connectionParams = {
				token : state.token ?? ""
			};
		},
		logout(state) {
			state.uid           = undefined;
			state.token         = undefined;
			state.authenticated = false;

			auth.signOut();

			cable_link.connectionParams = {
				token : ""
			};
		}
	}
});

export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;