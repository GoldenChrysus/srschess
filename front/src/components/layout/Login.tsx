import React from "react";
import { Translation } from "react-i18next";
import { Modal } from "antd";

interface LoginProps {
}
interface LoginState {
	modal_visible : boolean
}

class Login extends React.Component<LoginProps, LoginState> {
	constructor(props: LoginProps) {
		super(props);

		this.login = this.login.bind(this);
		this.state = {
			modal_visible : false
		};
	}

	render() {
		return (
			<Translation ns="common">
				{
					(t) => (
						<>
							<a href="#" onClick={this.login}>{t("login")}</a>
							<Modal
								className="firebase-login"
								visible={this.state.modal_visible}
								footer=""
								forceRender={true}
								width={360}
								onCancel={this.login}
							>
								<div id="firebase-auth"></div>
							</Modal>
						</>
					)
				}
			</Translation>
		);
	}

	login() {
		const name_input = document.querySelector("[for=ui-sign-in-name-input]");

		if (name_input) {
			name_input.innerHTML = "Display name";
		}

		this.setState({
			modal_visible : !this.state.modal_visible
		});
	}
}

export default Login;