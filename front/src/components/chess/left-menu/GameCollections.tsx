import React, { useState } from "react";
import { Observer } from "mobx-react";
import { Translation } from "react-i18next";
import { Menu, Spin, Button } from "antd";
import { useQuery, useMutation } from "@apollo/client";

import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { CREATE_COLLECTION, GET_COLLECTIONS } from "../../../api/queries";
import "../../../styles/components/chess/left-menu/game-collections.css";

import Repertoire from "./Repertoires/Repertoire";
import ChessState from "../../../stores/ChessState";
import { CollectionsQueryData } from "../../../lib/types/models/Collection";
import AddCollection from "../../modals/AddCollection";

function GameCollections() {
	const [ modal_active, setModalActive ] = useState(false);
	const [ createCollection ] = useMutation(CREATE_COLLECTION, {
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

	const active_collection_id = ChessState.repertoire?.id;

	return (
		<Spin spinning={loading}>
			<Translation ns={["database", "common"]}>
				{
					(t) => (
						<Observer>
							{() => (
								<Menu
									id="collection-menu"
									mode="inline"
									selectedKeys={[ "collection-" + active_collection_id ]}
								>
									<Button className="ml-6" type="default" onClick={() => setModalActive(true)}>{t("create_collection")}</Button>
									{renderCollections(data)}
								</Menu>
							)}
						</Observer>
					)
				}
			</Translation>
			<AddCollection type="add" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit}/>
		</Spin>
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
				<Repertoire key={"collection-menu-item-" + collection.id} id={collection.id} slug={collection.slug} name={collection.name}/>
			</Menu.Item>
		);
	}

	return items;
}

export default GameCollections;