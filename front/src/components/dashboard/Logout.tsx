import React from "react";
import { Redirect } from "react-router-dom";
import AuthState from "../../stores/AuthState";

function Logout() {
	AuthState.logout();
	return <Redirect to="/"/>;
}

export default Logout;