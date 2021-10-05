import React from "react";
import { Link } from "react-router-dom";
import { Translation } from "react-i18next";
import { Collapse, Button, Progress } from "antd";
import { TFunction } from "i18next";

interface RepertoireProps {
	name?: string,
	slug?: string,
	lesson_count?: number
	review_count?: number
	mode: string
}

class Repertoire extends React.PureComponent<RepertoireProps> {
	original_lesson_count = 0;

	constructor(props: RepertoireProps) {
		super(props);

		this.updateLessonCount();
	}

	componentDidUpdate(prev_props: RepertoireProps) {
		if (prev_props.slug !== this.props.slug) {
			this.updateLessonCount();
		}
	}

	updateLessonCount() {
		this.original_lesson_count = this.props.lesson_count ?? 0;
	}

	render() {
		return (
			<Translation ns={["repertoires", "common"]}>
				{
					(t) => (
						<Collapse bordered={false} activeKey="repertoire-panel">
							<Collapse.Panel showArrow={false} id="repertoire-panel" header={this.getTitle(t)} key="repertoire-panel">
								{this.renderContent(t)}
							</Collapse.Panel>
						</Collapse>
					)
				}
			</Translation>
		)
	}

	getTitle(t: TFunction) {
		let t_key = "repertoire_builder";

		switch (this.props.mode) {
			case "lesson":
				t_key = "lessons";

				break;
		}

		return this.props.name + ": " + t(t_key);
	}

	renderContent(t: TFunction) {
		const lesson_count = this.props.lesson_count ?? 0;
		const review_count = this.props.review_count ?? 0;

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
					<Progress percent={(this.original_lesson_count - lesson_count) / this.original_lesson_count * 100}/>
				)
		}
	}
}

export default Repertoire;