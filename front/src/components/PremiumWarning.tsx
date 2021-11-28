import React from "react";
import { Button, Modal } from "antd";
import { Translation } from "react-i18next";

enum PremiumWarningTypes {
	embed = "embed",
	modal = "modal",
}

interface PremiumWarningProps {
	type: keyof typeof PremiumWarningTypes,
	message?: string
}

interface PremiumWarningState {
	modal_visible: boolean
}

class PremiumWarning extends React.Component<PremiumWarningProps, PremiumWarningState> {
	constructor(props: PremiumWarningProps) {
		super(props);

		this.state = {
			modal_visible : true
		};

		this.closeModal = this.closeModal.bind(this);
	}

	render() {
		switch (this.props.type) {
			case "embed":
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
				);

			case "modal":
				return (
					<Modal visible={this.state.modal_visible} onCancel={this.closeModal} footer={""}>
						<div className="w-full flex items-center inset-0" style={{ backdropFilter: "blur(6px)" }}>
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
					</Modal>
				);

			default:
				break;
		}
	}

	closeModal() {
		this.setState({
			modal_visible : false
		});
	}
}

export default PremiumWarning;