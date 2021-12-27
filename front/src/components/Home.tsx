import React from "react";
import { useTranslation } from "react-i18next";
import RepertoireDemo from "./home/RepertoireDemo";

function Home() {
	const { t } = useTranslation(["repertoires", "database", "openings", "premium"]);

	return (
		<div className="px-6 py-4">
			<div className="grid grid-cols-2 3xl:grid-cols-4 gap-6">
				<div className="px-8 py-4 bg-gray-900 rounded-3xl">
					<div>
						<h1 className="text-xl text-green-500">{t("repertoires:repertoire_builder")}</h1>
						<p>{t("repertoires:meta_description")}</p>
					</div>
					<div><RepertoireDemo/></div>
				</div>
				<div className="px-8 py-4 bg-gray-900 rounded-3xl">
					<div>
						<h1 className="text-xl text-green-500">{t("database:game_database")}</h1>
						<p>{t("database:meta_description")}</p>
					</div>
					<div></div>
				</div>
				<div className="px-8 py-4 bg-gray-900 rounded-3xl">
					<div>
						<h1 className="text-xl text-green-500">{t("openings:openings_explorer")}</h1>
						<p>{t("openings:meta_description")}</p>
					</div>
					<div></div>
				</div>
				<div className="px-8 py-4 bg-gray-900 rounded-3xl">
					<div>
						<h1 className="text-xl text-green-500">{t("database:game_collections")}</h1>
						<p>{t("database:collection_info")}</p>
						<p className="text-xs italic">* {t("premium:premium_only")}</p>
					</div>
					<div></div>
				</div>
			</div>
		</div>
	);
}

export default Home;