import React from "react";
import { observer } from "mobx-react";
import { Modal } from "antd";

import AuthState from "../../stores/AuthState";

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
			<>
				<a href="#" onClick={this.login}>Login</a>
				<Modal
					className="firebase-login"
					visible={this.state.modal_visible && !AuthState.authenticated}
					footer=""
					forceRender={true}
					width={360}
					onCancel={this.login}
				>
					<div id="firebase-auth"></div>
				</Modal>
			</>
		);
	}

	login() {
		this.setState({
			modal_visible : !this.state.modal_visible
		});
	}
}

export default observer(Login);