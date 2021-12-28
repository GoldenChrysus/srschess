import React from "react"
import Modal from "antd/lib/modal/Modal"
import AuthState from "../../stores/AuthState";
import { Observer } from "mobx-react";

function Login() {
	const onCancel = () => AuthState.setNeedsAuth(false);

	const name_input = document.querySelector("[for=ui-sign-in-name-input]");

	if (name_input) {
		name_input.innerHTML = "Display name";
	}

	return (
		<Observer>
			{
				() => (
					<Modal
						className="firebase-login"
						visible={AuthState.needs_auth}
						footer=""
						forceRender={true}
						width={360}
						onCancel={onCancel}
					>
						<div id="firebase-auth"></div>
					</Modal>
				)
			}
		</Observer>
	);
}

export default Login;
