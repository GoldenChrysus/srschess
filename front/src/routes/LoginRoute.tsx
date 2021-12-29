import React from "react";
import { RouteProps } from "react-router-dom";
import Login from "../components/Login";
import { LocationState } from "../lib/types/RouteTypes";

function LoginRoute(props: RouteProps<string>) {
	const state: LocationState | undefined = props.location?.state as LocationState | undefined;

	return <Login state={state}/>;
}

export default LoginRoute;