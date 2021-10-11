import { message } from "antd";
import React from "react";

class ErrorBoundary extends React.Component {
	componentDidCatch(error: any, info: any) {
		message.error("An unexpected error occurred.", 60000);
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;