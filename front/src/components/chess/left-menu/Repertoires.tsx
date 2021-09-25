import React from "react";
import { Link } from "react-router-dom";
import { Menu, Spin } from "antd";
import { useQuery } from "@apollo/client";

import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { GET_REPERTOIRES } from "../../../api/queries";

interface RepertoiresProps {
	active_id?: string,
	mode: ChessControllerProps["mode"]
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
			<Menu
				id="repertoire-menu"
				mode="inline"
				defaultOpenKeys={["white-repertoires", "black-repertoires"]}
				selectedKeys={[ "repertoire-" + props.active_id, "repertoire-" + props.mode + "s-" + props.active_id ]}
			>
				<Menu.SubMenu title="White Repertoires" key="white-repertoires">
					{renderRepertoires(data, "white", props)}
				</Menu.SubMenu>
				<Menu.SubMenu title="Black Repertoires" key="black-repertoires">
					{renderRepertoires(data, "black", props)}
				</Menu.SubMenu>
			</Menu>
		</Spin>
	);
}

function renderRepertoires(data: any, color: string, props: RepertoiresProps) {
	if (!data) {
		return null;
	}

	const items = [];

	for (const repertoire of data.repertoires) {
		if (repertoire.side !== color) {
			continue;
		}

		if (repertoire.id !== props.active_id) {
			items.push(
				<Menu.Item key={"repertoire-" + repertoire.id}>
					<Link to={{ pathname: "/repertoires/" + repertoire.id }}>
						{repertoire.name}
					</Link>
				</Menu.Item>
			);
		} else {
			items.push(
				<Menu.ItemGroup title={repertoire.name} key={"repertoire-" + repertoire.id}>
					<Menu.Item key={"repertoire-repertoires-" + repertoire.id}>
						<Link to={{ pathname: "/repertoires/" + repertoire.id }}>
							Repertoire Builder
						</Link>
					</Menu.Item>
					<Menu.Item key={"repertoire-lessons-" + repertoire.id}>
						<Link to={{ pathname: "/lessons/" + repertoire.id }}>
							Lessons: 10 Available
						</Link>
					</Menu.Item>
					<Menu.Item key={"repertoire-reviews-" + repertoire.id}>
						<Link to={{ pathname: "/reviews/" + repertoire.id }}>
							Reviews: 10 Available
						</Link>
					</Menu.Item>
				</Menu.ItemGroup>
			);
		}
	}

	return items;
}

export default Repertoires;