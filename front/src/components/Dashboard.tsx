import React from "react";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import "../styles/components/dashboard.css";
import UserInfo from "./dashboard/UserInfo";
import Logout from "./dashboard/Logout";

interface DashboardProps {
	active_section: string
}

const MENU = [
	{
		slug     : "user-info",
		i18n_key : "user_info"
	},
	{
		slug     : "logout",
		i18n_key : "logout"
	}
];

function Dashboard(props: DashboardProps): JSX.Element {
	const { t } = useTranslation("dashboard");
	const items = [];

	for (const item of MENU) {
		items.push(
			<Menu.Item key={"dashboard-menu-item-" + item.slug}>
				<NavLink className="font-bold" to={"/dashboard/" + item.slug}>{t(item.i18n_key)}</NavLink>
			</Menu.Item>
		)
	}

	return (
		<div id="dashboard-container" className="p-6 grid grid-cols-12 gap-4">
			<div className="col-span-12 md:col-span-2">
				<Menu selectedKeys={["dashboard-menu-item-" + props.active_section]}>
					{items}
				</Menu>
			</div>
			<div className="col-span-12 md:col-span-10">
				{renderComponent(props.active_section)}
			</div>
		</div>
	);
}

function renderComponent(section: string) {
	switch (section) {
		case "user-info":
			return <UserInfo/>;

		case "logout":
			return <Logout/>;

		default:
			break;
	}
}

export default Dashboard;