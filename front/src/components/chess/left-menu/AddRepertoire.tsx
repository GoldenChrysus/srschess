import React from "react";
import { Translation } from "react-i18next";
import { Modal, Form, Input, Button, Select } from "antd";

interface AddRepertoireProps {
	visible : boolean,
	toggleVisible: Function,
	onSubmit: Function
}

class AddRepertoire extends React.PureComponent<AddRepertoireProps> {
	constructor(props: AddRepertoireProps) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		return (
			<Translation ns={["common", "repertoires", "chess"]}>
				{
					(t) => (
						<Modal
							title={t("repertoires:create_repertoire")}
							visible={this.props.visible}
							onCancel={() => this.props.toggleVisible(false)}
							footer={[
								<Button onClick={() => this.props.toggleVisible(false)}>{t("cancel")}</Button>,
								<Button type="default" form="create-repertoire" htmlType="submit">{t("create")}</Button>
							]}
						>
							<Form id="create-repertoire" labelCol={{ span: 3 }} onFinish={this.onSubmit} autoComplete="off">
								<Form.Item
									label={t("name")}
									name="name"
									rules={[ { required: true, message: t("input_name")} ]}
								>
									<Input/>
								</Form.Item>
								<Form.Item
									label={t("chess:side")}
									name="side"
									rules={[ { required: true, message: t("chess:choose_side")} ]}
								>
									<Select>
										<Select.Option value="W">{t("chess:white")}</Select.Option>
										<Select.Option value="B">{t("chess:black")}</Select.Option>
									</Select>
								</Form.Item>
							</Form>
						</Modal>
					)
				}
			</Translation>
		);
	}

	onSubmit(values: any) {
		this.props.onSubmit(values);
	}
}

export default AddRepertoire;