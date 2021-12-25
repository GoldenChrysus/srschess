import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Footer() {
	const { t } = useTranslation(["common", "repertoires", "openings", "database", "premium"]);

	return (
		<div className="bg-gray-800 h-8 absolute -bottom-16 w-full mt-8 flex justify-center items-center">
			<div className="grid gap-4 grid-flow-col text-gray-500 text-xs">
				<span>Copyright &copy; 2021 Chess HQ, LLC</span>
				<span>
					<Link to="/repertoires/" className="text-gray-400">{t("repertoires:repertoires")}</Link>
				</span>
				<span>
					<Link to="/openings-explorer/" className="text-gray-400">{t("openings:openings_explorer")}</Link>
				</span>
				<span>
					<Link to="/game-database/" className="text-gray-400">{t("database:game_database")}</Link>
				</span>
				<span>
					<Link to="/upgrade/" className="text-gray-400">{t("premium:upgrade")}</Link>
				</span>
			</div>
		</div>
	);
}

export default Footer;