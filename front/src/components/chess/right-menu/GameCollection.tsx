import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Spin } from "antd";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collapse, Button, Popconfirm } from "antd";
import { TFunction } from "i18next";

import AuthState from "../../../stores/AuthState";
import { CollectionModel, CollectionQueryData } from "../../../lib/types/models/Collection";
import { GET_COLLECTION, EDIT_REPERTOIRE, DELETE_REPERTOIRE, GET_COLLECTIONS } from "../../../api/queries";

import AddCollection from "../../modals/AddCollection";
import { hasPremiumLockoutError } from "../../../helpers";
import PremiumWarning from "../../PremiumWarning";
import { Observer } from "mobx-react-lite";

interface GameCollectionProps {
	collection?: CollectionModel
}

function GameCollection(props: GameCollectionProps) {
	const [ modal_active, setModalActive ] = useState(false);
	const [ deleting, setDeleting ]        = useState(false);

	const [ editCollection, edit_res ]   = useMutation(EDIT_REPERTOIRE);
	const [ deleteCollection, delete_res ] = useMutation(DELETE_REPERTOIRE, {
		refetchQueries : [ GET_COLLECTIONS ]
	});

	const { t } = useTranslation(["database", "common", "premium"]);

	const { loading, error, data } = useQuery<CollectionQueryData>(
		GET_COLLECTION,
		{
			variables : {
				slug : props.collection?.slug
			},
			skip        : (props.collection === undefined),
			fetchPolicy : "cache-only"
		}
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		editCollection({
			variables : {
				...values,
				id : data?.collection?.id
			}
		});
	};

	const onDelete = () => {
		deleteCollection({
			variables : {
				id : data?.collection?.id
			}
		});
		setDeleting(true);
	}

	if (deleting && !delete_res.loading) {
		return (
			<Redirect to="/game-database/"/>
		);
	}

	return (
		<>
			<Collapse bordered={false} activeKey="repertoire-panel">
				<Collapse.Panel showArrow={false} id="repertoire-panel" header={getTitle(props)} key="repertoire-panel">
					<Spin spinning={error !== undefined || loading || delete_res.loading || edit_res.loading}>
						{renderContent(props, t, setModalActive, onDelete)}
						<AddCollection type="edit" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit} collection={data?.collection}/>
					</Spin>
				</Collapse.Panel>
			</Collapse>
		</>
	);
}

function renderContent(props: GameCollectionProps, t: TFunction, setModalActive: Function, onDelete: Function) {
	return (
		<Observer>
			{
				() =>
					<>
						{
							AuthState.authenticated &&
							<>
								<Button className="mr-2" type="ghost" onClick={() => setModalActive(true)}>{t("common:edit")}</Button>
								<Popconfirm
									title={t("common:delete_confirm")}
									okText={t("common:yes")}
									cancelText={t("common:cancel")}
									onConfirm={() => onDelete()}
								>
									<Button type="ghost">{t("common:delete")}</Button>
								</Popconfirm>
							</>
						}
					</>
			}
		
		</Observer>
	);
}

function getTitle(props: GameCollectionProps) {
	return props.collection?.name;
}

export default GameCollection;