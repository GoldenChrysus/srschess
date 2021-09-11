import React from "react";
import { observer } from "mobx-react";
import { Layout } from "antd";
import Chessboard from "./Chessboard";

import User from "../api/models/User";
import Repertoire from "../api/models/Repertoire";
import Move from "../api/models/Move";
import BaseStore from "../api/models/BaseStore";

interface ContainerProps {
	users: BaseStore;
}

class Container extends React.Component<ContainerProps> {
	async componentDidMount() {
		setTimeout(() => {
			User.byId(1);
		}, 2000);

		let rep = await Repertoire.byId(1);

		Move.add(
			"",
			{
				move_number : 10,
				move        : "d4",
				fen         : "test",
				sort        : 0,
			},
			{
				repertoire : {
					type : "repertoire",
					id   : rep.id
				}
			}
		);
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