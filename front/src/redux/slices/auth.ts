import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

import { cable_link } from "../../lib/Apollo";
import { auth } from "../../lib/Firebase";
import { AuthState } from "../../lib/types/ReduxTypes";

const initialState: AuthState = {
	show_login    : false,
	authenticated : false
};

export const AuthSlice = createSlice({
	name: "Auth",
	initialState,
	reducers : {
		toggleLogin(state, action: PayloadAction<AuthState["show_login"]>) {
			state.show_login = action.payload;
		},
		login(state, action: PayloadAction<User | any>) {
			state.uid           = action.payload?.uid
			state.token         = action.payload?.accessToken;
			state.authenticated = true;
			state.show_login    = false;
			
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

export const { toggleLogin, login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;