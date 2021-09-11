import React from "react";
import { observer } from "mobx-react";
import { Layout } from "antd";
import Chessboard from "./Chessboard";

import User from "../api/models/User";
import BaseStore from "../api/models/BaseStore";

interface ContainerProps {
	users: BaseStore;
}

class Container extends React.Component<ContainerProps> {
	async componentDidMount() {
		setTimeout(() => {
			User.byId(1);
		}, 2000);
	}

	render() {
		console.log(this.props.users.records);
		let users = [];

		for (let user_id in this.props.users.records) {
			users.push(user_id);
		}

		return (
			<Layout>
				<Layout.Header>
					{users.join(",")}
				</Layout.Header>
				<Layout>
					<Layout.Content>
						<Chessboard/>
					</Layout.Content>
				</Layout>
				<Layout.Footer>
					Footer
				</Layout.Footer>
			</Layout>
		);
	}
}

export default observer(Container);