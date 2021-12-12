import React, { useState } from "react";
import { Observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Menu, Spin, Button } from "antd";
import { useQuery, useMutation } from "@apollo/client";

import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { CREATE_COLLECTION, GET_COLLECTIONS } from "../../../api/queries";
import "../../../styles/components/chess/left-menu/game-collections.css";

import ChessState from "../../../stores/ChessState";
import { CollectionsQueryData } from "../../../lib/types/models/Collection";
import AddCollection from "../../modals/AddCollection";
import { hasPremiumLockoutError } from "../../../helpers";
import PremiumWarning from "../../PremiumWarning";
import GameCollection from "./GameCollections/GameCollection";

function GameCollections() {
	const { t }       = useTranslation(["database", "common", "premium"]);
	const [ modal_active, setModalActive ] = useState(false);
	const [ createCollection, create_res ] = useMutation(CREATE_COLLECTION, {
		refetchQueries : [ GET_COLLECTIONS ]
	});
	const { loading, error, data } = useQuery<CollectionsQueryData>(
		GET_COLLECTIONS
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		createCollection({
			variables : values
		});
	};

	const premium = hasPremiumLockoutError(create_res.error)
		? <PremiumWarning type="modal" message={t("premium:created_collection_limit")}/>
		: null;

	return (
		<>
			<Spin spinning={loading}>
					<Observer>
						{() => (
							<Menu
								id="collection-menu"
								mode="inline"
								selectedKeys={[ "collection-" + ChessState.collection?.id ]}
							>
								<Button className="ml-6 mb-6" type="default" onClick={() => setModalActive(true)}>{t("create_collection")}</Button>
								{renderCollections(data)}
							</Menu>
						)}
					</Observer>
				<AddCollection type="add" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit}/>
			</Spin>
			{premium}
		</>
	);
}

function renderCollections(data: CollectionsQueryData | undefined) {
	if (!data) {
		return null;
	}

	const items = [];

	for (const collection of data.collections) {
		items.push(
			<Menu.Item key={"collection-" + collection.id}>
				<GameCollection key={"collection-menu-item-" + collection.id} id={collection.id} slug={collection.slug} name={collection.name}/>
			</Menu.Item>
		);
	}

	return items;
}

export default GameCollections;