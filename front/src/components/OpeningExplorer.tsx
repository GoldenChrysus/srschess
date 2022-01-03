import React, { ChangeEvent, useState } from "react";
import { Input } from "antd";
import { useTranslation } from "react-i18next";
import { EcoPositionModel, EcoPositionsQueryData } from "../lib/types/models/EcoPosition";
import OpeningVolume from "./opening-explorer/OpeningVolume";

interface OpeningExplorerProps {
	openings?: EcoPositionsQueryData["ecoPositions"]
}

let processed = false;

const indexed: {[key: string]: Array<EcoPositionModel>} = {
	A : [],
	B : [],
	C : [],
	D : [],
	E : []
};

function OpeningExplorer(props: OpeningExplorerProps) {
	const [ filter, setFilter ] = useState<string | null>(null);
	const { t } = useTranslation(["common", "openings"]);

	if (!processed && props?.openings) {
		for (const opening of props?.openings ?? []) {
			const index: string = opening.code[0];

			if (!indexed[index]) {
				continue;
			}

			indexed[index].push(opening);
		}

		processed = true;
	}

	const onFilter = function(e: ChangeEvent<HTMLInputElement>) {
		setFilter(e.target.value);
	}

	const volumes = [];

	for (const volume in indexed) {
		volumes.push(<OpeningVolume key={"opening-volume-" + volume} volume={volume} openings={indexed[volume]} filter={filter}/>);
	}

	return (
		<div className="p-6">
			<Input addonBefore={t("filter")} onChange={onFilter} allowClear={true} placeholder={t("openings:filter")}/>
			{volumes}
		</div>
	);
}

export default OpeningExplorer;