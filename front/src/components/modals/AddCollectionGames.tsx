import React from "react";
import { Translation } from "react-i18next";
import { Modal, Form, Input, Button } from "antd";
import { CollectionModel } from "../../lib/types/models/Collection";

interface AddCollectionGamesProps {
	visible: boolean,
	toggleVisible: Function,
	onSubmit: Function,
	collection: CollectionModel
}

class AddCollectionGames extends React.PureComponent<AddCollectionGamesProps> {
	constructor(props: AddCollectionGamesProps) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		return (
			<Translation ns={["common", "database", "chess"]}>
				{
					(t) => (
						<Modal
							title={t("database:import_pgn")}
							visible={this.props.visible}
							onCancel={() => this.props.toggleVisible(false)}
							footer={[
								<Button onClick={() => this.props.toggleVisible(false)}>{t("cancel")}</Button>,
								<Button type="default" form="import-pgn" htmlType="submit">{t("submit")}</Button>
							]}
						>
							<Form
								id="import-pgn"
								labelCol={{ span: 3 }}
								onFinish={this.onSubmit}
								autoComplete="off"
							>
								<Form.Item
									label="PGN"
									name="pgn"
									rules={[ { required: true, message: t("database:input_pgn")} ]}
								>
									<Input.TextArea rows={10}/>
								</Form.Item>
							</Form>
						</Modal>
					)
				}
			</Translation>
		);
	}

	onSubmit(values: any) {
		if (!values.public) {
			values.public = false;
		}

		this.props.onSubmit(values);
	}
}

export default AddCollectionGames;