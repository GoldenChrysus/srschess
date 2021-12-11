import React, { useState } from "react";
import { Observer } from "mobx-react";
import { Translation } from "react-i18next";
import { Menu, Spin, Button } from "antd";
import { useQuery, useMutation } from "@apollo/client";

import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { CREATE_REPERTOIRE, GET_COLLECTIONS } from "../../../api/queries";
import "../../../styles/components/chess/left-menu/game-collections.css";

import AddRepertoire from "../../modals/AddRepertoire";
import Repertoire from "./Repertoires/Repertoire";
import ChessState from "../../../stores/ChessState";
import { CollectionsQueryData } from "../../../lib/types/models/Collection";

function GameCollections() {
	const [ modal_active, setModalActive ] = useState(false);
	const [ createRepertoire ] = useMutation(CREATE_REPERTOIRE, {
		refetchQueries : [ GET_COLLECTIONS ]
	});
	const { loading, error, data } = useQuery<CollectionsQueryData>(
		GET_COLLECTIONS
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		createRepertoire({
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
			<AddRepertoire type="add" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit}/>
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