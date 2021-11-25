import React from "react";
import { Select } from "antd";
import { useQuery } from "@apollo/client";
import { GET_ECO } from "../../../api/queries";
import { EcoPositionQueryData } from "../../../lib/types/models/EcoPosition";

function EcoSelect() {
	const { loading, error, data } = useQuery<EcoPositionQueryData>(GET_ECO);

	const options = [];

	console.log(data);

	if (data?.ecoPositions) {
		for (const eco of data.ecoPositions) {
			options.push(
				<Select.Option value={eco.id} key={"eco-" + eco.id}>{eco.code}: {eco.name}</Select.Option>
			);
		}
	}

	return (
		<Select
			showSearch
			allowClear={true}
			filterOption={(input, option) => option?.children.join(" ").toLowerCase().indexOf(input.toLowerCase()) !== -1}
		>
			{options}
		</Select>
	)
}

export default EcoSelect;