import React from "react";
import { Helmet } from "react-helmet";
import { Translation } from "react-i18next";
import { generateCanonicalURL, ROUTES } from "../helpers";

import "../styles/_base.less";
import Container from "./Container";
import ErrorBoundary from "./ErrorBoundary";

class App extends React.Component {
	componentDidMount(): void {
		document.addEventListener("click", (e) => {
			const target = e.target;

			if (target instanceof HTMLElement) {
				if (target.nodeName === "BUTTON") {
					target.blur();
				} else if (target.parentElement?.nodeName === "BUTTON") {
					target.parentElement.blur();
				}
			}
		});
	}

	render(): JSX.Element {
		const url = generateCanonicalURL(ROUTES.home);

		return (
			<ErrorBoundary>
				<Translation ns="common">
					{(t, i18n) => (
						<Helmet
							titleTemplate="%s - Chess HQ"
							defaultTitle={"Chess HQ - " + t("meta_title")}
						>
							<title lang={i18n.lng}></title>
							<meta lang={i18n.lng} name="description" content={t("meta_description")}/>
							<link rel="canonical" href={url}/>
							<link rel="manifest" href={process.env.PUBLIC_URL + "/manifest." + (i18n.lng ?? "en") + ".json"}/>
							<meta property="og:type" content="website"/>
							<meta lang={i18n.lng} property="og:title" content={"Chess HQ - " + t("meta_title")}/>
							<meta lang={i18n.lng} property="og:description" content={t("meta_description")}/>
							<meta property="og:image" content={process.env.REACT_APP_PUBLIC_URL + "/assets/images/business/logo1024.png"}/>
							<meta property="og:url" content={url}/>
							<meta lang={i18n.lng} property="og:site_name" content="Chess HQ"/>
							<meta name="twitter:card" content="summary_large_image"/>
							<meta lang={i18n.lng} property="twitter:title" content={"Chess HQ - " + t("meta_title")}/>
							<meta lang={i18n.lng} property="twitter:description" content={t("meta_description")}/>
							<meta property="twitter:image" content={process.env.REACT_APP_PUBLIC_URL + "/assets/images/business/logo1024.png"}/>
							<meta property="twitter:site" content="@ChessHQcom"/>
							<meta property="twitter:creator" content="@ChessHQcom"/>
						</Helmet>
					)}
				</Translation>
				<Container/>
			</ErrorBoundary>
		);
	}
}

export default App;
