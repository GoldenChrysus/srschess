import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Spin } from "antd";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collapse, Button, Progress, Popconfirm } from "antd";
import { TFunction } from "i18next";

import AuthState from "../../../stores/AuthState";
import { RepertoireModel, RepertoireQueryData } from "../../../lib/types/models/Repertoire";
import { GET_REPERTOIRE_CACHED, EDIT_REPERTOIRE, DELETE_REPERTOIRE, GET_REPERTOIRES, CLONE_REPERTOIRE } from "../../../api/queries";

import AddRepertoire from "../../modals/AddRepertoire";
import { hasPremiumLockoutError } from "../../../helpers";
import PremiumWarning from "../../PremiumWarning";

interface RepertoireProps {
	repertoire?: RepertoireModel
	mode: string
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
	const [ cloneRepertoire, clone_res ] = useMutation(CLONE_REPERTOIRE, {
		refetchQueries: [ GET_REPERTOIRES ]
	});

	const { t }       = useTranslation(["repertoires", "common"]);
	const prev_id_ref = useRef<RepertoireModel["id"] | undefined>(props.repertoire?.id);

	const { loading, error, data } = useQuery<RepertoireQueryData>(
		GET_REPERTOIRE_CACHED,
		{
			variables : {
				slug : props.repertoire?.slug
			},
			skip        : (props.repertoire === undefined),
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

	const onCopy = () => {
		cloneRepertoire({
			variables : {
				id : props.repertoire?.id
			}
		});
	}

	useEffect(() => {
		if (props.repertoire?.id !== prev_id_ref.current) {
			original_lesson_count = 0;
			original_review_count = 0;
		}

		prev_id_ref.current = props.repertoire?.id;
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

	const premium = hasPremiumLockoutError(clone_res.error) ? <PremiumWarning type="modal" message={t("premium:cloned_repertoire_limit")}/> : null;

	return (
		<>
			<Collapse bordered={false} activeKey="repertoire-panel">
				<Collapse.Panel showArrow={false} id="repertoire-panel" header={getTitle(props, t)} key="repertoire-panel">
					<Spin spinning={error !== undefined || loading || delete_res.loading || edit_res.loading}>
						{renderContent(props, t, lesson_count, review_count, setModalActive, onDelete, onCopy)}
						{props.mode === "repertoire" && (
							<AddRepertoire type="edit" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit} repertoire={data?.repertoire}/>
						)}
					</Spin>
				</Collapse.Panel>
			</Collapse>
			{premium}
		</>
	);
}

function renderContent(props: RepertoireProps, t: TFunction, lesson_count: number, review_count: number, setModalActive: Function, onDelete: Function, onCopy: Function) {
	switch (props.mode) {
		case "repertoire":
			return (
				<>
					{
						props.repertoire?.userOwned &&
						<>
							<Link to={{pathname: "/lessons/" + props.repertoire?.slug}}>
								<Button className="mr-2" type="primary">{t("train")} ({lesson_count})</Button>
							</Link>
							<Link to={{pathname: "/reviews/" + props.repertoire?.slug}}>
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
					}
					{
						props.repertoire?.public &&
						!props.repertoire?.userOwned &&
						<Popconfirm
							className="ml-2"
							title={t("common:copy_confirm")}
							okText={t("common:yes")}
							cancelText={t("common:cancel")}
							onConfirm={() => onCopy()}
						>
							<Button type="ghost">{t("common:copy")}</Button>
						</Popconfirm>
					}
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

	return props.repertoire?.name + ": " + t(t_key);
}

export default Repertoire;