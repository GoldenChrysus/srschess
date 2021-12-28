import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "@reduxjs/toolkit/node_modules/immer/dist/internal";
import { User } from "firebase/auth";

import { AuthState } from "../../lib/types/ReduxTypes";

const initialState: AuthState = {
	show_login    : false,
	authenticated : false,
	token         : ""
};

export const AuthSlice = createSlice({
	name: "Auth",
	initialState,
	reducers : {
		provideClient(state: any, action: PayloadAction<AuthState["client"]>) {
			state.client = action.payload;
		},
		provideLink(state, action: PayloadAction<AuthState["link"]>) {
			state.link = action.payload;
		},
		provideAuth(state, action: PayloadAction<AuthState["auth_object"]>) {
			state.auth_object = action.payload;
		},
		toggleLogin(state, action: PayloadAction<AuthState["show_login"]>) {
			state.show_login = action.payload;
		},
		login(state, action: PayloadAction<User>) {
			state.user          = action.payload;
			state.authenticated = true;
			
			action.payload.getIdToken().then((token: string) => {
				state.token = token;

				if (state.link) {
					state.link.connectionParams = {
						token : token
					};
				}
			});
		},
		logout(state) {
			state.user          = undefined;
			state.authenticated = false;
			state.token         = "";

			if (state.link) {
				state.link.connectionParams = {
					token : state.token
				}
			}
		}
	}
});

export const { provideClient, provideLink, provideAuth, login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;