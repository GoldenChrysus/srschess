import React from "react";
import { Link } from "react-router-dom";
import { Translation } from "react-i18next";
import { Collapse, Button } from "antd";

interface RepertoireProps {
	name?: string,
	id?: string,
	mode: string
}

class Repertoire extends React.PureComponent<RepertoireProps> {
	render() {
		return (
			<Translation ns={["repertoires", "common"]}>
				{
					(t) => (
						<Collapse bordered={false} activeKey="repertoire-panel">
							<Collapse.Panel showArrow={false} id="repertoire-panel" header={this.props.name} key="repertoire-panel">
								<Link to={{pathname: "/lessons/" + this.props.id}}>
									<Button className="mr-2" type="primary">{t("train")}</Button>
								</Link>
								<Link to={{pathname: "/reviews/" + this.props.id}}>
									<Button className="mr-2" type="default">{t("review")}</Button>
								</Link>
								<Button type="ghost">{t("common:edit")}</Button>
							</Collapse.Panel>
						</Collapse>
					)
				}
			</Translation>
		)
	}
}

export default Repertoire;