import React from "react";
import { Form, Input, Tabs, Select, Button } from "antd";
import { Translation } from "react-i18next";
import { SearchCriteria, SearchProps, SearchState } from "../../lib/types/SearchTypes";

import Results from "./search/Results";

class Search extends React.Component<SearchProps, SearchState> {
	constructor(props: SearchProps) {
		super(props);

		this.state = {
			criteria : undefined
		};

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		return (
			<>
				<Translation ns={["search", "chess"]}>
					{(t) => (
						<Tabs defaultActiveKey="form">
							<Tabs.TabPane tab={t("by_criteria")} key="form">
								<Form onFinish={this.onSubmit}>
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
									<Form.Item>
										<Button type="ghost" htmlType="submit">{t("search")}</Button>
									</Form.Item>
								</Form>
							</Tabs.TabPane>
							<Tabs.TabPane tab={t("by_move_input")} key="moves">
								{t("move_input_prompt")}
							</Tabs.TabPane>
						</Tabs>
					)}
				</Translation>
				<Results criteria={this.state.criteria} mode={this.props.mode}/>
			</>
		);
	}

	onSubmit(data: SearchCriteria["data"]) {
		this.setState({
			criteria: {
				mode : this.props.mode,
				data : data
			}
		});
	}
}

export default Search;