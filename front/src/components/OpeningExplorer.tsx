import React from "react";
import { EcoPositionModel, EcoPositionQueryData } from "../lib/types/models/EcoPosition";
import OpeningVolume from "./opening-explorer/OpeningVolume";

interface OpeningExplorerProps {
	openings?: EcoPositionQueryData["ecoPositions"]
}

function OpeningExplorer(props: OpeningExplorerProps) {
	const indexed: {[key: string]: Array<EcoPositionModel>} = {
		A : [],
		B : [],
		C : [],
		D : [],
		E : []
	};

	for (const opening of props?.openings ?? []) {
		const index: string = opening.code[0];

		if (!indexed[index]) {
			continue;
		}

		indexed[index].push(opening);
	}

	const volumes = [];

	for (const volume in indexed) {
		volumes.push(<OpeningVolume key={"opening-volume-" + volume} volume={volume} openings={indexed[volume]}/>);
	}

	return (
		
		<div className="p-4">
			{volumes}
		</div>
		
	);
}

export default OpeningExplorer;