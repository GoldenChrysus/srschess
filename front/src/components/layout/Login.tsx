import React from "react";
import { Translation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { toggleLogin } from "../../redux/slices/auth";

class Login extends React.Component<PropsFromRedux> {
	constructor(props: PropsFromRedux) {
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
		this.props.showLogin(true);
	}
}

const mapDispatchToProps = {
	showLogin : (on: boolean) => toggleLogin(on)
}
const connector      = connect(undefined, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Login);