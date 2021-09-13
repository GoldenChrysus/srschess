import React from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";

class MainLayout extends React.Component<any> {
	render() {
		const layout_classes  = [
			"bg-gray-500"
		];
		const header_classes  = [
			"bg-gray-900",
			"h-16",
			"3xl:h-32"
		];
		const content_classes = [];

		let footer: any = (
			<div className="bg-gray-300 h-32">
				Footer
			</div>
		);

		if (this.props.location.pathname === "/") {
			layout_classes.push("md:h-screen");
			layout_classes.push("md:max-h-screen");
			layout_classes.push("md:overflow-y-hidden");
			layout_classes.push("md:flex");
			layout_classes.push("md:flex-col");

			header_classes.push("md:flex");

			content_classes.push("md:flex-1");
			content_classes.push("md:h-full")

			footer = null;
		}

		return (
			<div className={layout_classes.join(" ")}>
				<div className={header_classes.join(" ")}>
					Header
				</div>
				<div id="content" className={content_classes.join(" ")}>
					{this.props.children}
				</div>
				{footer}
			</div>
		);
	}
}

export default withRouter(MainLayout);