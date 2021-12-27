import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Footer() {
	const { t } = useTranslation(["common", "repertoires", "openings", "database", "premium"]);

	const years = [2021];
	const year  = (new Date()).getFullYear();

	if (year > 2021) {
		years.push(year);
	}

	return (
		<div className="bg-gray-800 h-8 absolute -bottom-16 w-full mt-8 flex justify-center items-center text-center">
			<div className="grid grid-cols-4 md:grid-cols-none md:grid-flow-col gap-x-4 text-gray-500 text-2xs md:text-xs">
				<div className="col-span-4 md:col-span-1">Copyright &copy; {years.join("-")} Chess HQ, LLC</div>
				<div>
					<Link to="/repertoires/" className="text-gray-400">{t("repertoires:repertoires")}</Link>
				</div>
				<div>
					<Link to="/openings-explorer/" className="text-gray-400">{t("openings:openings_explorer")}</Link>
				</div>
				<div>
					<Link to="/game-database/" className="text-gray-400">{t("database:game_database")}</Link>
				</div>
				<div>
					<Link to="/upgrade/" className="text-gray-400">{t("premium:upgrade")}</Link>
				</div>
			</div>
		</div>
	);
}

export default Footer;