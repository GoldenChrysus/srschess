import React from "react";
import { withRouter } from "react-router-dom";

import Login from "./layout/Login";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

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

		// Footer offset
		content_classes.push("mb-16");

		return (
			<div className={layout_classes.join(" ")}>
				<div className={header_classes.join(" ")}>
					<Header/>
				</div>
				<div id="content" className={content_classes.join(" ")}>
					{this.props.children}
					<Footer/>
				</div>
			</div>
		);
	}
}

export default withRouter(MainLayout);