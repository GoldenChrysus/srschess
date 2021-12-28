import React, { useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { updateEmail, updatePassword } from "firebase/auth";
import { notifyError } from "../../helpers";
import { RootState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { toggleLogin } from "../../redux/slices/auth";

let awaiting_refresh: boolean          = false;
let last_submit: any                   = undefined;
let last_auth_time: string | undefined = "";

function UserInfo(props: PropsFromRedux) {
	const [ processing, setProcessing ] = useState(false);
	const { t }                         = useTranslation(["dashboard", "common", "errors"]);
	const user                          = props.user;
	const onSubmit                      = async (values: any, from_refresh?: boolean) => {
		if (!user || (awaiting_refresh && !from_refresh)) {
			return;
		}

		console.log("SUBMITTED");
		setProcessing(true);

		try {
			const email = values.email;

			if (email && email !== user.email) {
				await updateEmail(user, email);
			}

			if (values.password) {
				await updatePassword(user, values.password);
			}

			setProcessing(false);
		} catch (e: any) {
			if (awaiting_refresh) {
				return;
			}

			console.log("FAILED");
			console.log(e.code);

			switch (e.code) {
				case "auth/user-token-expired":
				case "auth/requires-recent-login":
					awaiting_refresh = true;
					last_submit      = values;
					last_auth_time   = user.metadata.lastSignInTime;

					props.showLogin(true);
					break;

				default:
					notifyError(e.code);
					break;
			}

			setProcessing(false);
		}
	};

	(async () => {
		if (awaiting_refresh && user && last_auth_time !== user.metadata.lastSignInTime) {
			console.log("RESUBMITTING");

			awaiting_refresh = false;

			onSubmit(last_submit, true);
		}
	})();

	return (
		<Spin spinning={processing}>
			<div className="px-4 pt-2">
				<Form
					id="user-info-form"
					onFinish={onSubmit}
					autoComplete="off"
					initialValues={{
						email : user?.email
					}}
				>
					<div className="grid grid-cols-2 gap-x-4">
						<div className="col-span-2 md:col-span-1">
							<Form.Item
								label={t("email")}
								name="email"
								rules={[ { required: true, message: t("input_email")} ]}
							>
								<Input name="email"/>
							</Form.Item>
						</div>
						<div className="col-span-2 md:col-span-1">
							<Form.Item label={t("password")} name="password">
								<Input type="password"/>
							</Form.Item>
						</div>
					</div>
					<Form.Item>
						<Button type="default" htmlType="submit">{t("common:save")}</Button>
					</Form.Item>
				</Form>
			</div>
		</Spin>
	);
}

const mapStateToProps = (state: RootState) => ({
	user : state.Auth.user
});
const mapDispatchToProps = {
	showLogin : (on: boolean) => toggleLogin(on)
};
const connector      = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(UserInfo);