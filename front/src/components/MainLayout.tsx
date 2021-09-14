import React from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";

class MainLayout extends React.Component<any> {
	render() {
		const layout_classes  = [
			"bg-gray-500",
			"min-h-screen",
			"flex",
			"flex-col"
		];
		const header_classes  = [
			"bg-gray-900",
			"h-16",
			"flex"
		];
		const content_classes = [
			"flex-1",
			"h-full",
			"relative"
		];

		let footer: any = (
			<div className="bg-gray-300 h-32 absolute -bottom-32 w-full">
				Footer
			</div>
		);

		if (this.props.location.pathname.substr(0, 12) === "/repertoires") {
			layout_classes.push("md:h-screen");
			layout_classes.push("md:max-h-screen");
			layout_classes.push("md:overflow-y-hidden");

			footer = null;
		} else {
			content_classes.push("mb-32");
		}

		return (
			<div className={layout_classes.join(" ")}>
				<div className={header_classes.join(" ")}>
					Header
				</div>
				<div id="content" className={content_classes.join(" ")}>
					{this.props.children}
					{footer}
				</div>
			</div>
		);
	}
}

export default withRouter(MainLayout);