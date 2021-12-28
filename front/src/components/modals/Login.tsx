import React from "react"
import Modal from "antd/lib/modal/Modal"
import { toggleLogin } from "../../redux/slices/auth";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";

function Login(props: PropsFromRedux) {
	const onCancel = () => props.showLogin(false);

	const name_input = document.querySelector("[for=ui-sign-in-name-input]");

	if (name_input) {
		name_input.innerHTML = "Display name";
	}

	return (
		<Modal
			className="firebase-login"
			visible={props.needs_login}
			footer=""
			forceRender={true}
			width={360}
			onCancel={onCancel}
		>
			<div id="firebase-auth"></div>
		</Modal>
	);
}

const mapStateToProps = (state: RootState) => ({
	needs_login : state.Auth.show_login
});
const mapDispatchToProps = {
	showLogin : (on: boolean) => toggleLogin(on)
}
const connector      = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Login);
