import React from "react";
import { Menu, Dropdown } from "antd";
import { Translation } from "react-i18next";
import { Observer } from "mobx-react";
import { Link, NavLink } from "react-router-dom";

import i18n from "../../i18n";
import AuthState from "../../stores/AuthState";

import Login from "./Login";

import "../../styles/components/layout/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface Map {
	[locale: string]: {
		lang: string,
		flag: string
	}
}

const LANGUAGE_MAP: Map = {
	en : {
		lang : "English",
		flag : "GB",
	},
	ja : {
		lang : "日本語",
		flag : "JP"
	}
}

class Header extends React.Component {
	render() {
		return (
			<Translation ns={["common", "repertoires", "openings", "database"]}>
				{
					(t) => (
						<div className="w-full py-1 px-6 flex items-center">
							<div id="logo" className="w-28 mr-6">
								<Link to="/">
									<img src="/assets/images/business/logo.png"/>
								</Link>
							</div>
							<nav className="flex flex-1 items-center h-full">
								<NavLink to="/repertoires/" isActive={(match, location) => {
									return (!!match || ["reviews", "lessons"].includes(location.pathname.split("/")[1]))
								}}>
									{t("repertoires:repertoires")}
								</NavLink>
								<NavLink to={{ pathname: "/openings-explorer/"}}>
									{t("openings:openings_explorer")}
								</NavLink>
								<NavLink to={{ pathname: "/game-database/"}}>
									{t("database:game_database")}
								</NavLink>
							</nav>
							<div className="flex flex-initial items-center h-full">
								<Observer>
									{() => this.renderUserLogin()}
								</Observer>
								{this.renderLanguageFlag()}
							</div>
						</div>
					)
				}
			</Translation>
		);
	}

	renderUserLogin() {
		return (AuthState.authenticated) ? this.renderUser() : this.renderLogin();
	}

	renderLogin() {
		return <Login/>;
	}

	renderUser() {
		return (
			<Link to="/dashboard" className="text-white">
				<FontAwesomeIcon icon={faUser} size="sm"/>
			</Link>
		);
	}

	renderLanguageFlag() {
		const lang = i18n.language;
		const flag = LANGUAGE_MAP[lang]?.flag ?? "GB";

		const menu_items = [];

		for (const locale in LANGUAGE_MAP) {
			if (locale === lang) {
				continue;
			}

			menu_items.push(
				<Menu.Item key={"language-" + locale} onClick={() => this.changeLanguage(locale)}>
					<div className="flex items-center">
						<img id="language-flag" alt={locale} className="mr-2" src={"/assets/images/flags/" + LANGUAGE_MAP[locale].flag + ".png"}/>
						{LANGUAGE_MAP[locale].lang}
					</div>
				</Menu.Item>
			);
		}

		const menu = (
			<Menu>
				{menu_items}
			</Menu>
		);

		return (
			<Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
				<img id="language-flag" alt={lang} className="ml-4 cursor-pointer" src={"/assets/images/flags/" + flag + ".png"}/>
			</Dropdown>
		);
	}

	changeLanguage(locale: string) {
		localStorage.setItem("locale", locale);
		i18n.changeLanguage(locale);
	}
}

export default Header;