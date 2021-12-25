import { message, notification } from "antd";
import React from "react";
import i18n from "../i18n";

class ErrorBoundary extends React.Component {
	static getDerivedStateFromError(error: any) {
	}

	componentDidCatch(error: any, info: any) {
		const duration = (process.env.NODE_ENV === "development") ? 0 : 4.5;

		notification.error({
			message  : i18n.t("errors:unexpected"),
			duration : duration
		});
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;