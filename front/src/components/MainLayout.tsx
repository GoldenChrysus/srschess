import React from "react";
import { withRouter } from "react-router-dom";

import Login from "./layout/Login";

class MainLayout extends React.Component<any> {
	render() {
		const layout_classes  = [
			"bg-gray-800",
			"min-h-screen",
			"flex",
			"flex-col",
		];
		const header_classes  = [
			"bg-gray-900",
			"flex",
			"h-11",
			"min-h-11",
		];
		const content_classes = [
			"flex-1",
			"h-full",
			"relative"
		];

		let footer: any = (
			<div className="bg-gray-500 h-32 absolute -bottom-32 w-full">
				Footer
			</div>
		);

		if (["repertoires", "reviews", "lessons"].includes(this.props.location.pathname.split("/").at(-2))) {
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
					<Login/>
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