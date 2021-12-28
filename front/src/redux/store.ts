import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";

const store = configureStore({
	reducer : {
		Auth: auth
	}
});

export default store;