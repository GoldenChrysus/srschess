import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Spin } from "antd";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collapse, Button, Progress, Popconfirm } from "antd";
import { TFunction } from "i18next";

import { RepertoireModel, RepertoireQueryData } from "../../../lib/types/models/Repertoire";
import { GET_REPERTOIRE_CACHED, EDIT_REPERTOIRE, DELETE_REPERTOIRE, GET_REPERTOIRES } from "../../../api/queries";

import AddRepertoire from "../../modals/AddRepertoire";

interface RepertoireProps {
	name? : RepertoireModel["name"],
	slug? : RepertoireModel["slug"],
	mode  : string
}

var original_review_count = 0;
var original_lesson_count = 0;

function Repertoire(props: RepertoireProps) {
	const [ modal_active, setModalActive ] = useState(false);
	const [ deleting, setDeleting ]        = useState(false);

	const [ editRepertoire, edit_res ]   = useMutation(EDIT_REPERTOIRE);
	const [ deleteRepertoire, delete_res ] = useMutation(DELETE_REPERTOIRE, {
		refetchQueries : [ GET_REPERTOIRES ]
	});

	const { t }         = useTranslation(["repertoires", "common"]);
	const prev_slug_ref = useRef<RepertoireProps["slug"]>(props.slug);

	const { loading, error, data } = useQuery<RepertoireQueryData>(
		GET_REPERTOIRE_CACHED,
		{
			variables : {
				slug : props.slug
			},
			fetchPolicy : "cache-only"
		}
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		editRepertoire({
			variables : {
				...values,
				id : data?.repertoire?.id
			}
		});
	};

	const onDelete = () => {
		deleteRepertoire({
			variables : {
				id : data?.repertoire?.id
			}
		});
		setDeleting(true);
	}

	useEffect(() => {
		if (props.slug !== prev_slug_ref.current) {
			original_lesson_count = 0;
			original_review_count = 0;
		}

		prev_slug_ref.current = props.slug;
	});

	const lesson_count = data?.repertoire?.lessonQueueLength ?? 0;
	const review_count = data?.repertoire?.reviewQueueLength ?? 0;

	if (lesson_count !== undefined && (original_lesson_count === undefined || lesson_count > original_lesson_count)) {
		original_lesson_count = lesson_count;
	}

	if (review_count !== undefined && (original_review_count === undefined || review_count > original_review_count)) {
		original_review_count = review_count;
	}

	if (deleting && !delete_res.loading) {
		return (
			<Redirect to="/repertoires/"/>
		);
	}

	return (
		<Collapse bordered={false} activeKey="repertoire-panel">
			<Collapse.Panel showArrow={false} id="repertoire-panel" header={getTitle(props, t)} key="repertoire-panel">
				<Spin spinning={error !== undefined || loading || delete_res.loading || edit_res.loading}>
					{renderContent(props, t, lesson_count, review_count, setModalActive, onDelete)}
					{props.mode === "repertoire" && (
						<AddRepertoire type="edit" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit} repertoire={data?.repertoire}/>
					)}
				</Spin>
			</Collapse.Panel>
		</Collapse>
	);
}

function renderContent(props: RepertoireProps, t: TFunction, lesson_count: number, review_count: number, setModalActive: Function, onDelete: Function) {
	switch (props.mode) {
		case "repertoire":
			return (
				<>
					<Link to={{pathname: "/lessons/" + props.slug}}>
						<Button className="mr-2" type="primary">{t("train")} ({lesson_count})</Button>
					</Link>
					<Link to={{pathname: "/reviews/" + props.slug}}>
						<Button className="mr-2" type="default">{t("review")} ({review_count})</Button>
					</Link>
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
			);

		case "lesson":
			return (
				<Progress percent={Math.round((original_lesson_count - lesson_count) / original_lesson_count * 100)}/>
			);

		case "review":
			return (
				<Progress percent={Math.round((original_review_count - review_count) / original_review_count * 100)}/>
			);

		default:
			return <></>;
	}
}

function getTitle(props: RepertoireProps, t: TFunction) {
	let t_key = "repertoire_builder";

	switch (props.mode) {
		case "lesson":
		case "review":
			t_key = props.mode + "s";

			break;
	}

	return props.name + ": " + t(t_key);
}

export default Repertoire;