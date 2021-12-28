import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

import { cable_link } from "../../lib/Apollo";
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
		login(state, action: PayloadAction<User>) {
			state.user          = action.payload;
			state.authenticated = true;
			state.show_login    = false;
			
			action.payload.getIdToken().then((token: string) => {
				cable_link.connectionParams = {
					token : token
				};
			});
		},
		logout(state) {
			state.user          = undefined;
			state.authenticated = false;

			cable_link.connectionParams = {
				token : ""
			};
		}
	}
});

export const { toggleLogin, login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;