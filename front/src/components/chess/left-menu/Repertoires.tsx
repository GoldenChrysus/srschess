import React from "react";
import { Link } from "react-router-dom";
import { Menu, Spin } from "antd";
import { useQuery } from "@apollo/client";

import { GET_REPERTOIRES } from "../../../api/queries";

interface RepertoiresProps {
	active_id?: string
}

function Repertoires(props: RepertoiresProps) {
	const { loading, error, data } = useQuery(
		GET_REPERTOIRES,
		{
			variables : {
				userId : "1"
			}
		}
	);

	return (
		<Spin spinning={loading}>
			<Menu id="repertoire-menu" mode="inline" defaultOpenKeys={["white-repertoires", "black-repertoires"]} selectedKeys={[ "repertoire-" + props.active_id ]}>
				<Menu.SubMenu title="White Repertoires" key="white-repertoires">
					{renderRepertoires(data, "white")}
				</Menu.SubMenu>
				<Menu.SubMenu title="Black Repertoires" key="black-repertoires">
					{renderRepertoires(data, "black")}
				</Menu.SubMenu>
			</Menu>
		</Spin>
	);
}

function renderRepertoires(data: any, color: string) {
	if (!data) {
		return null;
	}

	const items = [];

	for (const repertoire of data.repertoires) {
		if (repertoire.side !== color) {
			continue;
		}

		items.push(
			<Menu.Item key={"repertoire-" + repertoire.id}>
				<Link to={{ pathname: "/repertoires/" + repertoire.id }}>
					{repertoire.name}
				</Link>
			</Menu.Item>
		);
	}

	return items;
}

export default Repertoires;