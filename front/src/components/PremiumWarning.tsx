import React from "react";
import { Button } from "antd";
import { Translation } from "react-i18next";

interface PremiumWarningProps {
	message?: string
}

class PremiumWarning extends React.Component<PremiumWarningProps> {
	render() {
		const message = this.props.message ?? "Premium feature only.";

		return (
			<div className="w-full flex items-center absolute inset-0" style={{ backdropFilter: "blur(6px)" }}>
				<div className="m-auto text-center">
					<span className="filter text-lg font-semibold" style={{ textShadow: "0 0 5px #000" }}>{message}</span>
					<div>
						<Translation ns="premium">
							{
								(t) => (
									<Button type="default" style={{ color: "#fff", textShadow: "0 0 4px #000" }}>{t("upgrade_now")}</Button>
								)
							}
						</Translation>
					</div>
				</div>
			</div>
		)
	}
}

export default PremiumWarning;