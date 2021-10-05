import React, { useState } from "react";
import { Translation } from "react-i18next";
import { Link } from "react-router-dom";
import { Menu, Spin, Button } from "antd";
import { useQuery, useMutation } from "@apollo/client";

import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { CREATE_REPERTOIRE, GET_REPERTOIRES } from "../../../api/queries";
import "../../../styles/components/chess/left-menu/repertoires.css";

import AddRepertoire from "./AddRepertoire";
import { TFunction } from "i18next";

interface RepertoiresProps {
	active_id?: number,
	mode: ChessControllerProps["mode"]
}

function Repertoires(props: RepertoiresProps) {
	const [ modal_active, setModalActive ] = useState(false);
	const [ createRepertoire ] = useMutation(CREATE_REPERTOIRE, {
		refetchQueries : [ GET_REPERTOIRES ]
	});
	const { loading, error, data } = useQuery(
		GET_REPERTOIRES
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		createRepertoire({
			variables : values
		});
	};

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
							<Button type="default" onClick={() => setModalActive(true)}>{t("create_repertoire")}</Button>
							<Menu.SubMenu title={t("white_repertoires")} key="white-repertoires">
								{renderRepertoires(data, "white", t)}
							</Menu.SubMenu>
							<Menu.SubMenu title={t("black_repertoires")} key="black-repertoires">
								{renderRepertoires(data, "black", t)}
							</Menu.SubMenu>
						</Menu>
					)
				}
			</Translation>
			<AddRepertoire visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit}/>
		</Spin>
	);
}

function renderRepertoires(data: any, color: string, t: TFunction) {
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
				<Link to={{ pathname: "/repertoires/" + repertoire.slug }}>
					{repertoire.name}
				</Link>
			</Menu.Item>
		);
	}

	return items;
}

export default Repertoires;