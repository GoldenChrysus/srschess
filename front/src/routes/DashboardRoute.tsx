import React from "react";
import { Observer, observer } from "mobx-react";
import { Redirect, useParams } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import AuthState from "../stores/AuthState";

interface DashboardRouteParams {
	section: string
}

function DashboardRoute() {
	const { section } = useParams<DashboardRouteParams>();

	return (
		<Observer>
			{() => {
				if (!AuthState.auth?.currentUser) {
					return <Redirect to="/"/>;
				}

				return <Dashboard active_section={section}/>;
			}}
		</Observer>
	);
}

export default DashboardRoute;