import React, { useState } from "react";
import { Button, Col, Form, Input, Row, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import AuthState from "../../stores/AuthState";
import { updateEmail, updatePassword } from "firebase/auth";
import { notifyError } from "../../helpers";

let awaiting_refresh: boolean = false;
let last_submit: any          = undefined;
let last_token: string        = "";

function UserInfo() {
	const [ processing, setProcessing ] = useState(false);
	const { t }                         = useTranslation(["dashboard", "common", "errors"]);
	const user                          = AuthState.user;
	const onSubmit                      = async (values: any) => {
		if (!user) {
			return;
		}

		setProcessing(true);
		await user.getIdToken(true);
		await user.reload();

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
			console.log(e.code)
			switch (e.code) {
				case "auth/user-token-expired":
				case "auth/requires-recent-login":
					awaiting_refresh = true;
					last_submit      = values;
					last_token       = await user.getIdToken();

					AuthState.setNeedsAuth(true);
					break;

				default:
					notifyError(e.code);
					break;
			}

			setProcessing(false);
		}
	};

	(async () => {
		console.log(last_submit);
		console.log(last_token);
		console.log(awaiting_refresh);
		console.log(await user?.getIdToken());
		if (awaiting_refresh && user && last_token !== await user.getIdToken()) {
			console.log("gh2");
			onSubmit(last_submit);
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

export default observer(UserInfo);