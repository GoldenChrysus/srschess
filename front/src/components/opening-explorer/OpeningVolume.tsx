import React from "react";
import { Divider } from "antd";
import { useTranslation } from "react-i18next";
import { EcoPositionModel } from "../../lib/types/models/EcoPosition";
import OpeningPaginator from "./opening-volume/OpeningPaginator";

interface OpeningVolumeProps {
	volume: string,
	openings: Array<EcoPositionModel>
}

function OpeningVolume(props: OpeningVolumeProps) {
	const { t } = useTranslation("chess");

	return (
		<div className="pb-4">
			<Divider orientation="left">{t("eco_" + props.volume.toLowerCase())}</Divider>
			<OpeningPaginator openings={props.openings}/>
		</div>
	);
}

export default OpeningVolume;