import React from "react";
import { Observer, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Translation } from "react-i18next";
import { Collapse, Button, Progress } from "antd";
import { TFunction } from "i18next";
import RepertoireStore from "../../../stores/RepertoireStore";
import { RepertoireModel } from "../../../lib/types/models/Repertoire";

interface RepertoireProps {
	name?: string,
	id?: number,
	slug?: string,
	mode: string
}

class Repertoire extends React.PureComponent<RepertoireProps> {
	original_lesson_count = 0;
	original_review_count = 0;

	componentDidUpdate(prev_props: RepertoireProps) {
		if (prev_props.slug !== this.props.slug ||
			prev_props.id !== this.props.id
		) {
			this.original_review_count = 0;
			this.original_review_count = 0;
		}
	}

	render() {
		return (
			<Translation ns={["repertoires", "common"]}>
				{
					(t) => (
						<Observer>
							{() => (
								<Collapse bordered={false} activeKey="repertoire-panel">
									<Collapse.Panel showArrow={false} id="repertoire-panel" header={this.getTitle(t)} key="repertoire-panel">
										{this.renderContent(t)}
									</Collapse.Panel>
								</Collapse>
							)}
						</Observer>
					)
				}
			</Translation>
		)
	}

	getTitle(t: TFunction) {
		let t_key = "repertoire_builder";

		switch (this.props.mode) {
			case "lesson":
			case "review":
				t_key = this.props.mode + "s";

				break;
		}

		return this.props.name + ": " + t(t_key);
	}

	renderContent(t: TFunction) {
		const repertoire   = RepertoireStore.get(this.props.id);
		const lesson_count = repertoire?.lessonQueueLength ?? 0;
		const review_count = repertoire?.reviewQueueLength ?? 0;

		if (lesson_count !== undefined && (this.original_lesson_count === undefined || lesson_count > this.original_lesson_count)) {
			this.original_lesson_count = lesson_count;
		}

		if (review_count !== undefined && (this.original_review_count === undefined || review_count > this.original_review_count)) {
			this.original_review_count = review_count;
		}

		switch (this.props.mode) {
			case "repertoire":
				return (
					<>
						<Link to={{pathname: "/lessons/" + this.props.slug}}>
							<Button className="mr-2" type="primary">{t("train")} ({lesson_count})</Button>
						</Link>
						<Link to={{pathname: "/reviews/" + this.props.slug}}>
							<Button className="mr-2" type="default">{t("review")} ({review_count})</Button>
						</Link>
						<Button type="ghost">{t("common:edit")}</Button>
					</>
				);

			case "lesson":
				return (
					<Progress percent={Math.round((this.original_lesson_count - lesson_count) / this.original_lesson_count * 100)}/>
				);

			case "review":
				return (
					<Progress percent={Math.round((this.original_review_count - review_count) / this.original_review_count * 100)}/>
				);
		}
	}
}

export default observer(Repertoire);