import React from "react";
import { notifyError } from "../helpers";

class ErrorBoundary extends React.Component {
	static getDerivedStateFromError(error: any) {
	}

	componentDidCatch(error: any, info: any) {
		notifyError();
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;