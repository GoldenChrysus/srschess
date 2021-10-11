import React from "react";

import "../styles/app.css";
import Container from "./Container";
import ErrorBoundary from "./ErrorBoundary";

class App extends React.Component {
	render() {
		return (
			<ErrorBoundary>
				<Container/>
			</ErrorBoundary>
		);
	}
}

export default App;
