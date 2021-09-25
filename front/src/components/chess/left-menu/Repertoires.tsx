import React from "react";
import { Translation } from "react-i18next";
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
			<Translation ns="repertoires">
				{
					(t) => (
						<Menu
							id="repertoire-menu"
							mode="inline"
							defaultOpenKeys={["white-repertoires", "black-repertoires"]}
							selectedKeys={[ "repertoire-" + props.active_id, "repertoire-" + props.mode + "s-" + props.active_id ]}
						>
							<Menu.SubMenu title={t("white_repertoires")} key="white-repertoires">
								{renderRepertoires(data, "white", props, t)}
							</Menu.SubMenu>
							<Menu.SubMenu title={t("black_repertoires")} key="black-repertoires">
								{renderRepertoires(data, "black", props, t)}
							</Menu.SubMenu>
						</Menu>
					)
				}
			</Translation>
		</Spin>
	);
}

function renderRepertoires(data: any, color: string, props: RepertoiresProps, t: any) {
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