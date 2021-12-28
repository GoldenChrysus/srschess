import React from "react";
import { withRouter } from "react-router-dom";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Login from "./modals/Login";

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
			"h-12",
			"min-h-12",
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
				<Login/>
			</div>
		);
	}
}

export default withRouter(MainLayout);