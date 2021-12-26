import React from "react";
import { Helmet } from "react-helmet";
import { Translation } from "react-i18next";
import { generateCanonicalURL, ROUTES } from "../helpers";

import "../styles/app.css";
import Container from "./Container";
import ErrorBoundary from "./ErrorBoundary";

class App extends React.Component {
	render() {
		const url = generateCanonicalURL(ROUTES.home);

		return (
			<ErrorBoundary>
				<Translation ns="common">
					{(t, i18n) => (
						<Helmet
							titleTemplate="%s - Chess HQ"
							defaultTitle={"Chess HQ - " + t("site_title")}
						>
							<title lang={i18n.lng}></title>
							<meta lang={i18n.lng} name="description" content=""/>
							<link rel="canonical" href={url}/>
							<link rel="manifest" href={process.env.PUBLIC_URL + "/manifest." + i18n.lng + ".json"}/>
							<meta lang={i18n.lng} property="og:type" content="website"/>
							<meta lang={i18n.lng} property="og:title" content={"Chess HQ - " + t("site_title")}/>
							<meta lang={i18n.lng} property="og:description" content=""/>
							<meta property="og:url" content={url}/>
							<meta lang={i18n.lng} property="og:site_name" content="Chess HQ"/>
							<meta lang={i18n.lng} property="twitter:title" content={"Chess HQ - " + t("site_title")}/>
							<meta lang={i18n.lng} property="twitter:description" content=""/>
						</Helmet>
					)}
				</Translation>
				<Container/>
			</ErrorBoundary>
		);
	}
}

export default App;
