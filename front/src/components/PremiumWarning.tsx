import React from "react";
import { Button } from "antd";
import { Translation } from "react-i18next";

interface PremiumWarningProps {
	message?: string
}

class PremiumWarning extends React.Component<PremiumWarningProps> {
	render() {
		return (
			<div className="w-full flex items-center absolute inset-0" style={{ backdropFilter: "blur(6px)" }}>
				<div className="m-auto text-center">
					<Translation ns="premium">
						{
							(t) => (
								<>
									<span className="filter text-lg font-semibold" style={{ textShadow: "0 0 5px #000" }}>
										{(this.props.message) ?? t("premium_only")}
									</span>
									<div>
										<Button className="premium" type="default" style={{ color: "#fff", textShadow: "0 0 4px #000" }}>
											{t("upgrade_now")}
										</Button>
									</div>
								</>
							)
						}
					</Translation>
				</div>
			</div>
		)
	}
}

export default PremiumWarning;