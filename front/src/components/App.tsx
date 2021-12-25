import React from "react";
import { Helmet } from "react-helmet";
import { Translation } from "react-i18next";

import i18n from "../i18n";
import "../styles/app.css";
import Container from "./Container";
import ErrorBoundary from "./ErrorBoundary";

class App extends React.Component {
	render() {
		return (
			<ErrorBoundary>
				<Translation ns="common">
					{t => (
						<Helmet
							titleTemplate="%s - Chess HQ"
							defaultTitle={"Chess HQ - " + t("site_title")}
						>
							<title lang={i18n.language}></title>
						</Helmet>
					)}
				</Translation>
				<Container/>
			</ErrorBoundary>
		);
	}
}

export default App;
