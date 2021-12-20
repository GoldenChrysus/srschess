import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Tabs, Select, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

import { GET_ECO } from "../../api/queries";
import { EcoPositionQueryData } from "../../lib/types/models/EcoPosition";
import { SearchCriteria, SearchProps, SearchState } from "../../lib/types/SearchTypes";

import Results from "./search/Results";

function Search(props: SearchProps) {
	const [ active_tab, setActiveTab ] = useState<string>("form");
	const [ state, setState ] = useState<SearchState>({
		criteria : undefined
	});
	const [ move_searching, setMoveSearching ] = useState<boolean>(false);
	const { t } = useTranslation(["search", "chess"]);
	const { loading, error, data } = useQuery<EcoPositionQueryData>(GET_ECO);
	const prev_movelist = useRef<string>();

	useEffect(() => {
		if (move_searching && prev_movelist.current !== props.movelist) {
			prev_movelist.current = props.movelist;

			setState({
				criteria : {
					mode : props.mode,
					data : {
						movelist : props.movelist
					}
				}
			});
		}
	});

	function onSubmit(data: SearchCriteria["data"]) {
		setState({
			criteria: {
				mode : props.mode,
				data : data
			}
		});
	}

	function onMoveSearchClick() {
		const new_state = !move_searching;

		setMoveSearching(new_state);
		props.onMoveSearchChange?.(new_state);
	}

	function onTabChange(active: string) {
		setActiveTab(active);

		if (active !== "moves" && move_searching) {
			onMoveSearchClick();
		}
	}

	function onResultClick() {
		if (move_searching) {
			onMoveSearchClick();
		}
	}

	const eco_options = [];

	if (active_tab === "form" && data?.ecoPositions) {
		for (const eco of data.ecoPositions) {
			const title = eco.code + ": " + eco.name;

			eco_options.push(
				<Select.Option value={eco.id} key={"search-eco-" + eco.id} title={title}>{title}</Select.Option>
			);
		}
	}

	return (
		<>
			<Tabs activeKey={active_tab} onChange={onTabChange} key="search-tabs">
				<Tabs.TabPane tab={t("by_criteria")} key="form">
					{
						active_tab === "form" &&
						<Form onFinish={onSubmit} key="search-form">
							<Form.Item label="FEN" name="fen" key="search-fen-item">
								<Input autoComplete="off"/>
							</Form.Item>
							<Form.Item label="ECO" name="eco" key="search-eco-item">
								<Select
									key="search-eco-select"
									showSearch
									allowClear={true}
									filterOption={(input, option) => option?.title.toLowerCase().indexOf(input.toLowerCase()) !== -1}
								>
									{eco_options}
								</Select>
							</Form.Item>
							{props.mode === "repertoires" &&
								<Form.Item label={t("chess:side")} name="side" key="search-side-item">
									<Select allowClear={true} key="search-side-select">
										<Select.Option value="white">{t("chess:white")}</Select.Option>
										<Select.Option value="black">{t("chess:black")}</Select.Option>
									</Select>
								</Form.Item>
							}
							<Form.Item>
								<Button type="ghost" htmlType="submit">{t("search")}</Button>
							</Form.Item>
						</Form>
					}
				</Tabs.TabPane>
				<Tabs.TabPane tab={t("by_move_input")} key="moves">
					<p>{t("move_input_prompt")}</p>
					<p><Button type="ghost" onClick={onMoveSearchClick}>{move_searching ? t("stop_searching") : t("start_searching")}</Button></p>
				</Tabs.TabPane>
			</Tabs>
			<Results criteria={state.criteria} mode={props.mode} onResultClick={onResultClick}/>
		</>
	);
}

export default Search;