import React from "react";
import { Layout } from "antd";
import Chessboard from "./Chessboard";

import User from "../api/models/User";

class Container extends React.Component {
	async componentDidMount() {
		let user = await User.byId("1");

		console.log(user);

		user = await User.byId("1");

		console.log(user);
	}

	render() {
		return (
			<Layout>
				<Layout.Header>
					Header
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

export default Container;