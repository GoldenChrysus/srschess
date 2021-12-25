import React from "react";
import { Divider, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { EcoPositionModel } from "../../lib/types/models/EcoPosition";
import OpeningPaginator from "./opening-volume/OpeningPaginator";

interface OpeningVolumeProps {
	volume: string,
	openings: Array<EcoPositionModel>,
	filter: string | null
}

function OpeningVolume(props: OpeningVolumeProps) {
	const { t } = useTranslation("chess");
	let openings: OpeningVolumeProps["openings"] = [];

	if (props.filter?.length) {
		const filter = props.filter.toLowerCase();

		for (const opening of props.openings) {
			const search = (opening.code + ": " + opening.name + " " + opening.fen).toLowerCase();

			if (search.indexOf(filter) !== -1) {
				openings.push(opening);
			}
		}
	} else {
		openings = props.openings;
	}

	return (
		<div className="pb-4">
			<Divider orientation="left">{t("eco_" + props.volume.toLowerCase())}</Divider>
			<Spin spinning={!props.openings.length}>
				<OpeningPaginator openings={openings}/>
			</Spin>
		</div>
	);
}

export default OpeningVolume;