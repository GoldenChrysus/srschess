import React from "react";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import { RepertoireMoveModel } from "../../../lib/types/models/Repertoire";

interface ContextMenuProps {
	move_id: RepertoireMoveModel["id"],
	first_child?: boolean,
	last_child?: boolean
}

function ContextMenu(props: ContextMenuProps) {
	const { t } = useTranslation("common");

	return (
		<>
			<Menu.Item key="delete-move">{t("delete")}</Menu.Item>
			{props.first_child === false && <Menu.Item key="move-up">{t("move_up")}</Menu.Item>}
			{props.last_child === false && <Menu.Item key="move-down">{t("move_down")}</Menu.Item>}
		</>
	);
}

export default ContextMenu;