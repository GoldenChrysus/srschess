import React from "react";
import { notifyError } from "../helpers";

class ErrorBoundary extends React.Component {
	componentDidCatch(error: any, info: any) {
		notifyError();

		if (process.env.NODE_ENV === "development") {
			console.error(error);
			console.info(info);
		}
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;