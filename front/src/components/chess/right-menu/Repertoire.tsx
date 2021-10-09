import React, { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collapse, Button, Progress } from "antd";
import { TFunction } from "i18next";

import { RepertoireQueryData } from "../../../lib/types/models/Repertoire";
import { GET_REPERTOIRE_CACHED } from "../../../api/queries";

interface RepertoireProps {
	name?: string,
	slug?: string,
	mode: string
}

var original_review_count = 0;
var original_lesson_count = 0;

function Repertoire(props: RepertoireProps) {
	const { t } = useTranslation(["repertoires", "common"]);
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

	return (
		<Collapse bordered={false} activeKey="repertoire-panel">
			<Collapse.Panel showArrow={false} id="repertoire-panel" header={getTitle(props, t)} key="repertoire-panel">
				<Spin spinning={error !== undefined || loading}>
					{renderContent(props, t, lesson_count, review_count)}
				</Spin>
			</Collapse.Panel>
		</Collapse>
	);
}

function renderContent(props: RepertoireProps, t: TFunction, lesson_count: number, review_count: number) {
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
					<Button type="ghost">{t("common:edit")}</Button>
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