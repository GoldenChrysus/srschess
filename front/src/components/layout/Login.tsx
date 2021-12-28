import React from "react";
import { Translation } from "react-i18next";
import AuthState from "../../stores/AuthState";

class Login extends React.Component {
	constructor(props: any) {
		super(props);

		this.login = this.login.bind(this);
	}

	render() {
		return (
			<Translation ns="common">
				{
					(t) => <button onClick={this.login}>{t("login")}</button>
				}
			</Translation>
		);
	}

	login() {
		AuthState.setNeedsAuth(true);
	}
}

export default Login;