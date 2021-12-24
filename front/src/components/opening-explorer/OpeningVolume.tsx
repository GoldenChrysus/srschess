import React from "react";
import { Divider, Spin } from "antd";
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
			<Spin spinning={!props.openings.length}>
				<OpeningPaginator openings={props.openings}/>
			</Spin>
		</div>
	);
}

export default OpeningVolume;