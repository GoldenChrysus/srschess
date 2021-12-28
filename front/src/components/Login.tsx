import React, { useState } from "react";
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/Firebase";
import { Button, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { notifyError } from "../helpers";
import { RootState } from "../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router-dom";

enum ProgressStates {
	initial,
	registering,
	existing
};

function Login(props: PropsFromRedux) {
	const { t }                     = useTranslation(["dashboard", "common"]);
	const [ loading, setLoading ]   = useState<boolean>(false);
	const [ progress, setProgress ] = useState<keyof typeof ProgressStates>("initial");
	const params                    = new URLSearchParams(window.location.search);
	
	if (props.authenticated) {
		return (<Redirect to={"/" + (params.get("redirect") || "repertoires") + "/"}/>);
	}

	const onSubmit = (values: any) => {
		setLoading(true);

		const email = values?.email;

		if (!email) {
			setLoading(false);
			return notifyError("auth/invalid-email");
		}

		const password = values.password ?? "";

		if (progress === "initial") {
			fetchSignInMethodsForEmail(auth, email)
				.then((data) => {
					setProgress((data.length) ? "existing" : "registering");
				})
				.catch((e) => {
					notifyError(e.code);
				})
				.finally(() => setLoading(false));
		} else if (progress === "registering") {
			const username = values.username ?? "";

			if (!password.length) {
				return notifyError("auth/wrong-password");
			}

			createUserWithEmailAndPassword(auth, email, password)
				.then((data) => {
					auth.updateCurrentUser(data.user);

					if (username.length) {
						updateProfile(data.user, {
							displayName : username
						})
							.catch(() => {
							})
							.finally(() => setLoading(false));
					} else {
						setLoading(false);
					}
				})
				.catch((e) => {
					notifyError(e.code);
					setLoading(false);
				});
		} else if (progress === "existing") {
			signInWithEmailAndPassword(auth, email, password)
				.then((data) => {
					auth.updateCurrentUser(data.user);
				})
				.catch((e) => {
					notifyError(e.code);
				})
				.finally(() => setLoading(false));
		}
	};

	const button_key = (progress === "initial") ? "continue" : "submit";

	return (
		<div className="w-full md:w-96 m-auto md:px-6 md:py-4">
			<Spin spinning={loading}>
				<div className="px-6 py-4">
					<Form
						id="login-form"
						onFinish={onSubmit}
						autoComplete="off"
						layout="vertical"
					>
						<Form.Item
							label={t("email")}
							name="email"
							rules={[ { required: true, message: t("input_email")} ]}
						>
							<Input name="email"/>
						</Form.Item>
						{
							progress === "registering" &&
							<Form.Item
								label={t("username")}
								name="username"
								rules={[ { required: true, message: t("input_username")} ]}
							>
								<Input type="username"/>
							</Form.Item>
						}
						{
							progress !== "initial" &&
							<Form.Item
								label={t("password")}
								name="password"
								rules={[ { required: true, message: t("input_password")} ]}
							>
								<Input type="password"/>
							</Form.Item>
						}
						<Form.Item className="text-right">
							<Button type="default" htmlType="submit">{t("common:" + button_key)}</Button>
						</Form.Item>
					</Form>
				</div>
			</Spin>
		</div>
	);
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Login);