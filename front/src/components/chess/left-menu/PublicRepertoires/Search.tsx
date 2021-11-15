import React from "react";
import { Form, Input, Tabs, Select } from "antd";
import { Translation } from "react-i18next";

class Search extends React.Component {
	render() {
		return (
			<Translation ns={["search", "chess"]}>
				{(t) => (
					<Tabs defaultActiveKey="form">
						<Tabs.TabPane tab={t("by_criteria")} key="form">
							<Form>
								<Form.Item label="FEN" name="fen">
									<Input/>
								</Form.Item>
								<Form.Item label="ECO" name="eco">
									<Select allowClear={true}>
										<Select.Option value="1">One</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item label={t("chess:side")} name="side">
									<Select allowClear={true}>
										<Select.Option value="white">{t("chess:white")}</Select.Option>
										<Select.Option value="black">{t("chess:black")}</Select.Option>
									</Select>
								</Form.Item>
							</Form>
						</Tabs.TabPane>
						<Tabs.TabPane tab={t("by_move_input")} key="moves">
							{t("move_input_prompt")}
						</Tabs.TabPane>
					</Tabs>
				)}
			</Translation>
		);
	}
}

export default Search;