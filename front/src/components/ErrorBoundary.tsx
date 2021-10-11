import { message } from "antd";
import React from "react";
import i18n from "../i18n";

class ErrorBoundary extends React.Component {
	static getDerivedStateFromError(error: any) {
	}

	componentDidCatch(error: any, info: any) {
		message.error(i18n.t("common:unexpected_error"));
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;