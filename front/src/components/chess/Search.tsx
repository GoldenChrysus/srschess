import React, { useState } from "react";
import { Form, Input, Tabs, Select, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

import { GET_ECO } from "../../api/queries";
import { EcoPositionQueryData } from "../../lib/types/models/EcoPosition";
import { SearchCriteria, SearchProps, SearchState } from "../../lib/types/SearchTypes";

import Results from "./search/Results";

function Search(props: SearchProps) {
	const [ state, setState ] = useState<SearchState>({
		criteria : undefined
	});
	const { t } = useTranslation(["search", "chess"]);
	const { loading, error, data } = useQuery<EcoPositionQueryData>(GET_ECO);

	function onSubmit(data: SearchCriteria["data"]) {
		setState({
			criteria: {
				mode : props.mode,
				data : data
			}
		});
	}

	const eco_options = [];

	if (data?.ecoPositions) {
		for (const eco of data.ecoPositions) {
			eco_options.push(
				<Select.Option value={eco.id} key={"eco-" + eco.id}>{eco.code}: {eco.name}</Select.Option>
			);
		}
	}

	return (
		<>
			<Tabs defaultActiveKey="form">
				<Tabs.TabPane tab={t("by_criteria")} key="form">
					<Form onFinish={onSubmit}>
						<Form.Item label="FEN" name="fen">
							<Input/>
						</Form.Item>
						<Form.Item label="ECO" name="eco">
							<Select
								showSearch
								allowClear={true}
								filterOption={(input, option) => option?.children.join("").toLowerCase().indexOf(input.toLowerCase()) !== -1}
							>
								{eco_options}
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
			<Results criteria={state.criteria} mode={props.mode}/>
		</>
	);
}

export default Search;