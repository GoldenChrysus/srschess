import React from "react";
import { observer } from "mobx-react";
import { Redirect, useParams } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import AuthState from "../stores/AuthState";

interface DashboardRouteParams {
	section: string
}

function DashboardRoute() {
	const { section } = useParams<DashboardRouteParams>();

	if (!AuthState.auth?.currentUser) {
		return <Redirect to="/"/>;
	}

	return <Dashboard active_section={section}/>;
}

export default observer(DashboardRoute);