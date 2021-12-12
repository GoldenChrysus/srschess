import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChess } from "@fortawesome/free-solid-svg-icons";

import { CollectionModel } from "../../../../lib/types/models/Collection";

interface GameCollectionProps {
	id   : CollectionModel["id"],
	slug : CollectionModel["slug"],
	name : CollectionModel["name"]
}

function GameCollection(props: GameCollectionProps) {
	const { t } = useTranslation(["database", "chess"]);

	return (
		<Link to={{ pathname: "/game-database/" + props.slug }} className="flex">
			<div className="flex pr-2 flex-1 overflow-hidden">
				<span className="overflow-hidden overflow-ellipsis">{props.name}</span>
			</div>
			<div className="flex flex-initial items-center">
				<FontAwesomeIcon icon={faChess} size="xs" className="mr-1"/>
				0 {t("chess:game", { count: 0 })}
			</div>
		</Link>
	)
}

export default GameCollection;